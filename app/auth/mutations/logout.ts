import { Ctx } from "blitz"

export default async function logout(_: unknown, ctx: Ctx) {
  return await ctx.session.$revoke()
}
