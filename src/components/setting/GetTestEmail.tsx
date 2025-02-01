'use client'
import React from 'react'
import { Button } from '../ui/button'
import { sendTestEmail } from '@/lib/CustomServerFunctions'
import { toast } from 'sonner'

function GetTestEmail() {
    const [loading, setLoading] = React.useState(false)
    const handleClick = async () => {
        setLoading(true)
        const res:any = await sendTestEmail()
        if (!res) {
            toast.error('Failed to send test email')
            setLoading(false)
            return
        }
        toast.success('Test email sent successfully!')
        setLoading(false)
    }
  return (
    <div  ><Button onClick={handleClick} disabled={loading} isLoading={loading}>Send Test Email</Button></div>
  )
}

export default GetTestEmail