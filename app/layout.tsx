import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import {Inter,Space_Grotesk} from 'next/font/google'
 import { Metadata } from 'next'


 import './globals.css'
import { ThemeProvider } from './context/ThemeProvider'

const inter = Inter({
  subsets:['latin'],
  weight: ['300','400','500','600','700','800','900'],
  variable:'--font-inter'
})


const spaceGrotesk = Space_Grotesk({
  subsets:['latin'],
  weight: ['300','400','500','600','700'],
  variable:'--font-spaceGrotesk'
})


export const  metadata : Metadata ={
  title:"dev_overflow",
  description:"An ap that enable developers ask questions,share ideas and solution "
  ,icons:{
    icon: '/assets/images/site-logo.svg'
  }

}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    
    <html lang="en">    
        <body className={`${inter.variable} ${spaceGrotesk.variable}`}>

        {/* <h1 className='h1-bold'>This is a piece of text</h1> */}
        <ClerkProvider
        appearance={{
          elements:{
            formButtonPrimary: 'primary-gradient',
            footerActionLink:'primary-text-gradient hover:text-primary-500'
    
          }
        }}>
          <ThemeProvider>
        
              {children}
          </ThemeProvider>
       </ClerkProvider>
          </body>
      </html>
  )
}