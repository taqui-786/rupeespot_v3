import Link from 'next/link'
 import notFoundImg from '../../public/notFound.png'
import { buttonVariants } from '@/components/ui/button'
import Image from 'next/image'
export default function NotFound() {
  return (
    <div className=' flex flex-col gap-3 items-center justify-center h-full w-full py-8'>
      <Image src={notFoundImg} alt="notFound" className='max-h-80 w-auto ' loading='eager'  />
      <Link href="/" className={buttonVariants()}>
            Return Home &rarr;
          </Link>
    </div>
  )
}