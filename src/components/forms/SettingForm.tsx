'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSession } from 'next-auth/react'

export function ChangeUserNameForm() {
  const { data: session }: any = useSession();
  return (
    <Card >
    <CardHeader>
      <CardTitle>Your Email</CardTitle>
      <CardDescription>
        Change your registered email address.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <Input placeholder={session?.user.email } />
      </form>
    </CardContent>
    <CardFooter className="border-t px-6 py-4">
      <Button disabled>Update</Button>
    </CardFooter>
  </Card>
  )
}