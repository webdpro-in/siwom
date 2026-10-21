import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
const base = process.env.QA_BASE || 'http://localhost:3100';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
let count = 0; let failed = 0;
const check = (name, value) => { if (!value) failed++; console.log(value ? 'PASS' : 'FAIL',name); count++; };
try {
 for (const theme of ['light','dark']) for (const width of [390,1440]) {
  const context = await browser.newContext({ viewport: {width,height:900}, colorScheme:theme, reducedMotion:'reduce' });
  const page = await context.newPage();
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  for (const path of ['/','/logistics','/safety','/contact','/industries','/about','/vision','/technology','/privacy','/terms','/styleguide','/missing-page']) {
   await page.goto(base+path,{waitUntil:'networkidle'});
   await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,20));}window.scrollTo(0,0);});
   await page.waitForTimeout(200);
   check(`system ${theme}, ${path}, ${width}`,await page.locator('html').getAttribute('data-theme')===theme);
   check(`no overflow ${theme}, ${path}, ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   check(`axe ${theme}, ${path}, ${width}: ${axe.violations.map(v=>`${v.id} ${v.nodes[0]?.target}`).join('; ')}`,axe.violations.length===0);
   const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.getClientRects().length&&i.complete&&i.naturalWidth===0).map(i=>i.src));
   check(`images ${theme}, ${path}, ${width}`,broken.length===0);
  }
  await page.goto(base+'/logistics#transport',{waitUntil:'networkidle'});
  const list=page.getByRole('tablist',{name:'Explore transport modes'});
  for(const mode of ['Water','Air','Road','Rail','Pipeline']) {
   await list.getByRole('tab',{name:mode,exact:true}).click();
   check(`transport ${mode}, ${theme}, ${width}`,await list.getByRole('tab',{name:mode,exact:true}).getAttribute('aria-selected')==='true');
  }
  await list.getByRole('tab',{name:'Pipeline',exact:true}).focus();
  await page.keyboard.press('Home');
  check('Home selects Water',await list.getByRole('tab',{name:'Water',exact:true}).getAttribute('aria-selected')==='true');
  await page.keyboard.press('ArrowRight');
  check('ArrowRight selects Air',await list.getByRole('tab',{name:'Air',exact:true}).getAttribute('aria-selected')==='true');
  await page.keyboard.press('End');
  check('End selects Pipeline',await list.getByRole('tab',{name:'Pipeline',exact:true}).getAttribute('aria-selected')==='true');
  const planner=page.getByRole('region',{name:'International logistics workspace demo'});
  await planner.locator('#international-lane').selectOption('europe-india');
  check('international lane changes shipment',await planner.getByText('DEMO-INT-1043').isVisible());
  await planner.getByRole('radio',{name:/Air \+ local road/}).check();
  check('air route changes handoff terminal',await planner.getByText('Mumbai airport',{exact:true}).isVisible());
  await planner.getByRole('button',{name:'Mark handoff reviewed'}).click();
  check('sample handoff review works',await planner.getByRole('button',{name:'Handoff reviewed · demo'}).isDisabled());
  await planner.getByRole('tab',{name:'Partner discovery'}).click();
  await planner.locator('#provider-region').selectOption('India');
  check('provider geography filter',await planner.getByText('1 illustrative provider profile',{exact:true}).isVisible());
  await planner.locator('#provider-mode').selectOption('Air');
  check('provider empty state',await planner.getByText('No example providers match.').isVisible());
  await planner.getByRole('button',{name:'Clear discovery filters'}).click();
  await planner.locator('#provider-search').fill('containers');
  check('provider cargo search',await planner.getByText('2 illustrative provider profiles',{exact:true}).isVisible());
  await planner.getByRole('button',{name:'Reset planning demo'}).click();
  check('reset restores provider list',await planner.getByText('4 illustrative provider profiles',{exact:true}).isVisible());
  check('no runtime errors',errors.length===0);
  await context.close();
 }
 const context=await browser.newContext({colorScheme:'light'});const page=await context.newPage();
 await page.goto(base,{waitUntil:'networkidle'});
 await page.emulateMedia({colorScheme:'dark'});
 await page.waitForFunction(()=>document.documentElement.dataset.theme==='dark');check('follows OS changes without saved preference',true);
 await page.getByRole('button',{name:'Switch to light theme'}).click();
 check('preference saved',await page.evaluate(()=>localStorage.getItem('siwom-theme'))==='light');
 await page.goto(base+'/about',{waitUntil:'networkidle'});
 check('preference survives navigation',await page.locator('html').getAttribute('data-theme')==='light');
 await page.reload({waitUntil:'networkidle'});
 check('preference survives reload',await page.locator('html').getAttribute('data-theme')==='light');
 await page.emulateMedia({colorScheme:'light'});await page.emulateMedia({colorScheme:'dark'});
 check('manual preference wins over system',await page.locator('html').getAttribute('data-theme')==='light');
 await context.close();
 console.log(`${count-failed}/${count} upgrade checks passed`); process.exitCode = failed ? 1 : 0;
} finally {await browser.close();}
