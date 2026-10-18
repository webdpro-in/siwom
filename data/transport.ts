export const transportModes = [
  {
    id: "water", label: "Water", number: "01", title: "Across oceans. Along rivers.", image: "water-container.webp",
    alt: "Container ship alongside terminal gantry cranes, viewed from above.",
    description: "Water freight connects production regions and markets at scale. Ports and inland terminals are the handoff points between vessels, roads and railways.",
    coordination: "Vessel arrivals and departures, container milestones, terminal handoffs and inland connections.",
    equipment: [
      { title: "Container ships", text: "Standardised metal containers transfer between ships, trucks and trains, keeping cargo together across transport modes." },
      { title: "Bulk carriers", text: "Purpose-built holds carry unpackaged dry commodities such as grain, coal and iron ore.", image: "bulk-carrier.webp", alt: "Dry bulk carrier with deck cranes and cargo holds." },
      { title: "Tankers", text: "Cargo-specific vessels carry crude oil, refined products or chemicals. LNG carriers require specialised containment and cryogenic handling systems.", image: "oil-tanker.webp", alt: "Oil tanker with piping and equipment across its deck." },
      { title: "Inland barges", text: "Often flat-bottomed, barges move bulk materials, containers and other freight along navigable rivers and canals.", image: "inland-barge.webp", alt: "Cargo barge travelling on an inland waterway." },
    ],
  },
  {
    id: "air", label: "Air", number: "02", title: "When every hour matters.", image: "air-cargo.webp",
    alt: "Dedicated China Airlines cargo aircraft parked on an airport apron at night.",
    description: "Air freight connects time-sensitive supply chains through cargo terminals, ground handling teams and onward road transport.",
    coordination: "Booking milestones, terminal acceptance, loading windows and airport-to-warehouse handoffs.",
    equipment: [
      { title: "Dedicated freighters", text: "Aircraft configured primarily for freight carry compatible pallets, containers and other cargo. The Boeing 747-8F is one example; SIWOM has no manufacturer or airline affiliation." },
      { title: "Passenger-flight belly cargo", text: "Eligible freight can travel in lower-deck holds alongside passenger baggage, subject to available weight and space, security and handling restrictions. Not every shipment needs a dedicated freighter.", image: "air-belly-cargo.webp", alt: "Ground handlers loading the lower-deck cargo hold of a passenger aircraft." },
    ],
  },
  {
    id: "road", label: "Road", number: "03", title: "The connection at every end.", image: "road-freight.webp",
    alt: "Heavy freight truck and trailer on a road.",
    description: "From first-mile collection to long-haul transport, regional distribution and final delivery, road freight connects the places other modes cannot reach.",
    coordination: "Fleet assignments, dispatch, route planning, capacity, delivery milestones, delays and exceptions.",
    equipment: [
      { title: "Semi-trucks & tractor-trailers", text: "Articulated vehicles move high-volume loads over long distances, with trailers selected for the cargo." },
      { title: "Box trucks", text: "Enclosed cargo bodies serve regional distribution, local business deliveries and weather-sensitive goods." },
      { title: "Flatbed trucks", text: "Open load platforms accommodate suitable construction materials, machinery and oversized cargo with proper securing." },
      { title: "Delivery vans", text: "Smaller vehicles connect collection points, neighbourhoods and the final delivery address." },
    ],
  },
  {
    id: "rail", label: "Rail", number: "04", title: "More volume. Longer horizons.", image: "rail-containers.webp",
    alt: "Freight locomotive hauling intermodal shipping containers along a railway.",
    description: "Rail moves large cargo volumes over long distances, connecting ports, industrial facilities, inland terminals and distribution networks.",
    coordination: "Terminal arrivals, rail cut-offs, wagon availability and transfers between rail and road.",
    equipment: [
      { title: "Boxcars", text: "Enclosed railcars protect suitable packaged freight from the weather." },
      { title: "Hopper cars", text: "Specialised cars carry loose bulk materials such as grain, coal or minerals, depending on their design. These are distinct from container trains." },
      { title: "Flatcars", text: "Open platforms carry suitable heavy machinery, equipment and oversized loads." },
      { title: "Intermodal flatcars & well cars", text: "Designed to carry shipping containers, with double stacking where equipment and route clearances permit." },
    ],
  },
  {
    id: "pipeline", label: "Pipeline", number: "05", title: "Continuous flow. Connected infrastructure.", image: "pipeline-valves.webp",
    alt: "Industrial steel pipes with valves and pressure-management equipment.",
    description: "Pipelines transport suitable liquids and gases through fixed networks. Materials, operating conditions and equipment must match the product being moved.",
    coordination: "A future research direction for inspection records, maintenance planning and operational follow-ups. SIWOM does not monitor or control pipelines.",
    equipment: [
      { title: "Pipes & valves", text: "Steel or other suitable materials form the network. Valves isolate sections and help manage product flow." },
      { title: "Liquid pumping stations", text: "Pumps provide the pressure needed to move suitable liquids, including certain petroleum products." },
      { title: "Gas compressor stations", text: "Compressors raise gas pressure to support flow through suitable networks, including natural-gas pipelines." },
      { title: "Monitoring & maintenance", text: "Pressure-management equipment, inspections and specialised monitoring systems support infrastructure operation and upkeep." },
    ],
  },
] as const;
