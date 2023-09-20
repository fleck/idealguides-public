import { SecurePassword, hash256 } from "@blitzjs/auth"
import type { Ctx } from "@blitzjs/next"
import { db } from "db"
import { ResetPassword } from "../validations"
import login from "./login"

export class ResetPasswordError extends Error {
  name = "ResetPasswordError"
  message = "Reset password link is invalid or it has expired."
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function resetPassword(input: any, ctx: Ctx) {
  ResetPassword.parse(input)
  // 1. Try to find this token in the database
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const hashedToken = hash256(input.token)
  const possibleToken = await db.token.findFirst({
    where: { hashedToken, type: "RESET_PASSWORD" },
    include: { user: true },
  })

  // 2. If token not found, error
  if (!possibleToken) {
    throw new ResetPasswordError()
  }
  const savedToken = possibleToken

  // 3. Delete token so it can't be used again
  await db.token.delete({ where: { id: savedToken.id } })

  // 4. If token has expired, error
  if (savedToken.expiresAt < new Date()) {
    throw new ResetPasswordError()
  }

  // 5. Since token is valid, now we can update the user's password
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const hashedPassword = await SecurePassword.hash(input.password.trim())
  const user = await db.user.update({
    where: { id: savedToken.userId },
    data: { hashedPassword },
  })

  // 6. Revoke all existing login sessions for this user
  await db.session.deleteMany({ where: { userId: user.id } })

  // 7. Now log the user in with the new credentials
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  await login({ email: user.email, password: input.password }, ctx)

  return true
}
