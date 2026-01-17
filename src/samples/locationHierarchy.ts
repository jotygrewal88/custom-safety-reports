/**
 * Mock Location Hierarchy Data
 * 
 * A 6-level organizational tree structure for testing.
 * Structure: Global > Region > Country > Facility > Department > Area
 */

import type { LocationNode } from "../schemas/locations";

export const mockLocationHierarchy: LocationNode[] = [
  {
    id: "loc_global",
    name: "Global Operations",
    level: 1,
    parentId: null,
    children: [
      {
        id: "loc_na",
        name: "North America",
        level: 2,
        parentId: "loc_global",
        children: [
          {
            id: "loc_usa",
            name: "United States",
            level: 3,
            parentId: "loc_na",
            children: [
              {
                id: "loc_chicago",
                name: "Chicago Plant",
                level: 4,
                parentId: "loc_usa",
                children: [
                  {
                    id: "loc_chicago_prod",
                    name: "Production",
                    level: 5,
                    parentId: "loc_chicago",
                    children: [
                      {
                        id: "loc_chicago_prod_line1",
                        name: "Line 1",
                        level: 6,
                        parentId: "loc_chicago_prod",
                      },
                      {
                        id: "loc_chicago_prod_line2",
                        name: "Line 2",
                        level: 6,
                        parentId: "loc_chicago_prod",
                      },
                      {
                        id: "loc_chicago_prod_line3",
                        name: "Line 3",
                        level: 6,
                        parentId: "loc_chicago_prod",
                      },
                    ],
                  },
                  {
                    id: "loc_chicago_warehouse",
                    name: "Warehouse",
                    level: 5,
                    parentId: "loc_chicago",
                    children: [
                      {
                        id: "loc_chicago_warehouse_receiving",
                        name: "Receiving",
                        level: 6,
                        parentId: "loc_chicago_warehouse",
                      },
                      {
                        id: "loc_chicago_warehouse_shipping",
                        name: "Shipping",
                        level: 6,
                        parentId: "loc_chicago_warehouse",
                      },
                    ],
                  },
                  {
                    id: "loc_chicago_maintenance",
                    name: "Maintenance Shop",
                    level: 5,
                    parentId: "loc_chicago",
                  },
                ],
              },
              {
                id: "loc_austin",
                name: "Austin Facility",
                level: 4,
                parentId: "loc_usa",
                children: [
                  {
                    id: "loc_austin_assembly",
                    name: "Assembly",
                    level: 5,
                    parentId: "loc_austin",
                    children: [
                      {
                        id: "loc_austin_assembly_stationA",
                        name: "Station A",
                        level: 6,
                        parentId: "loc_austin_assembly",
                      },
                      {
                        id: "loc_austin_assembly_stationB",
                        name: "Station B",
                        level: 6,
                        parentId: "loc_austin_assembly",
                      },
                    ],
                  },
                  {
                    id: "loc_austin_qa",
                    name: "Quality Assurance",
                    level: 5,
                    parentId: "loc_austin",
                  },
                ],
              },
            ],
          },
          {
            id: "loc_canada",
            name: "Canada",
            level: 3,
            parentId: "loc_na",
            children: [
              {
                id: "loc_toronto",
                name: "Toronto Distribution Center",
                level: 4,
                parentId: "loc_canada",
                children: [
                  {
                    id: "loc_toronto_warehouse",
                    name: "Warehouse",
                    level: 5,
                    parentId: "loc_toronto",
                  },
                  {
                    id: "loc_toronto_office",
                    name: "Office",
                    level: 5,
                    parentId: "loc_toronto",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "loc_eu",
        name: "Europe",
        level: 2,
        parentId: "loc_global",
        children: [
          {
            id: "loc_germany",
            name: "Germany",
            level: 3,
            parentId: "loc_eu",
            children: [
              {
                id: "loc_berlin",
                name: "Berlin Factory",
                level: 4,
                parentId: "loc_germany",
                children: [
                  {
                    id: "loc_berlin_manufacturing",
                    name: "Manufacturing",
                    level: 5,
                    parentId: "loc_berlin",
                    children: [
                      {
                        id: "loc_berlin_manufacturing_floor1",
                        name: "Floor 1",
                        level: 6,
                        parentId: "loc_berlin_manufacturing",
                      },
                      {
                        id: "loc_berlin_manufacturing_floor2",
                        name: "Floor 2",
                        level: 6,
                        parentId: "loc_berlin_manufacturing",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
