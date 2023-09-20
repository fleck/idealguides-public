import { NextApiRequest, NextApiResponse } from "next"
import ReactDOM from "react-dom/server"
import { tailwindId } from "../../../app/tailwind-id"
import path from "path"
import fs from "fs"
import db from "db"
import { publiclyCache } from "app/cache"

const buildIdPath = path.join(process.cwd(), ".next", "BUILD_ID")

const buildId =
  process.env.NODE_ENV === "production"
    ? fs.readFileSync(buildIdPath, "utf8")
    : Math.random().toString()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { url } = req.query

  if (typeof url !== "string") return res.status(404).send("")

  const embed = await db.embed.findFirst({ where: { url } })

  if (!embed) {
    await db.embed.create({ data: { url } })

    await publiclyCache({ res, req, for: [1, "minutes"] })

    return res.status(204).send("")
  }

  if (!embed.itemId) {
    await publiclyCache({ res, req, for: [1, "minutes"] })

    return res.status(204).send("")
  }

  return res.status(200).send(
    ReactDOM.renderToString(
      <>
        {/* Adding query string to the href to bust the cache */}
        <link
          href={`/embed.css?buildId=${encodeURIComponent(buildId)}`}
          rel="stylesheet"
        />
        {/*
          This id is to ensure that we don't conflict with any existing CSS on the page
          It should also give our CSS a little more specificity so it doesn't get
          overridden by any of the host pages styles. This id should match the
          important setting in tailwind-embed.config.js
         */}
        <div id={tailwindId}>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          scope="col"
                        >
                          <a href="https://idealguides.com/Comparison-of-Small-Hardware-and-Parts-Storage#amazon_id=idealguides-20">
                            Organizers
                          </a>
                        </th>
                        <th
                          className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          scope="col"
                        >
                          Price
                        </th>
                        <th
                          className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          scope="col"
                        >
                          Price Per Compartment
                        </th>
                        <th
                          className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          scope="col"
                        >
                          Max Compartments
                        </th>
                        <th
                          className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          scope="col"
                        >
                          Max Length
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <th className="text-left px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <a
                            className="text-blue-800 no-underline hover:underline"
                            rel="sponsored"
                            href="https://www.amazon.com/Plano-Molding-974-StowAway-Organizer/dp/B000CRHD6K/ref=pd_bxgy_469_img_2?ie=UTF8&refRID=0EJV41M86XE428GFMD09&tag=idealguides-20"
                          >
                            Plano Molding 974 StowAway Organizer Rack
                          </a>
                        </th>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a
                            className="text-blue-700 no-underline hover:underline"
                            rel="sponsored"
                            href="https://www.amazon.com/Plano-Molding-974-StowAway-Organizer/dp/B000CRHD6K/ref=pd_bxgy_469_img_2?ie=UTF8&refRID=0EJV41M86XE428GFMD09&tag=idealguides-20"
                          >
                            $39.63
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {" "}
                          $0.41{" "}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {" "}
                          96{" "}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          9&quot;
                        </td>
                      </tr>
                      <tr>
                        <th className="text-left px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <a
                            className="text-blue-800 no-underline hover:underline"
                            rel="sponsored"
                            href="https://www.amazon.com/Akro-Mils-10164-Plastic-Storage-Hardware/dp/B000LDH3JC/ref=pd_sim_469_4?dpID=51SaSUnaPNL&dpSrc=sims&ie=UTF8&preST=_AC_UL160_SR160%2C160_&refRID=0FW7803NKCBCEP6QBH72&tag=idealguides-20"
                          >
                            Akro-Mils 64 Drawer Plastic Parts Storage Hardware
                            Cabinet #10164
                          </a>
                        </th>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a
                            className="text-blue-700 no-underline hover:underline"
                            rel="sponsored"
                            href="https://www.amazon.com/Akro-Mils-10164-Plastic-Storage-Hardware/dp/B000LDH3JC/ref=pd_sim_469_4?dpID=51SaSUnaPNL&dpSrc=sims&ie=UTF8&preST=_AC_UL160_SR160%2C160_&refRID=0FW7803NKCBCEP6QBH72&tag=idealguides-20"
                          >
                            $33.95
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {" "}
                          $0.53{" "}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {" "}
                          64{" "}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          5.25&quot;
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>,
    ),
  )
}
