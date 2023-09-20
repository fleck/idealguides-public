import { db } from "db"
import { SecurePassword } from "@blitzjs/auth"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function signup(input: any, ctx: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const blitzContext = ctx

  const hashedPassword = await SecurePassword.hash(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (input.password as string) || "test-password",
  )
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-plus-operands
  const email = (input.email as string) || "test" + Math.random() + "@test.com"
  const user = await db.user.create({
    data: { email, hashedPassword, role: "user" },
    select: { id: true, name: true, email: true, role: true },
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  await blitzContext.session.$create({
    userId: user.id,
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  return { userId: blitzContext.session.userId, ...user, email: input.email }
}
