import Navbar from '@/components/shared/navbar/Navbar'
import React from 'react'

const Layout = ({children}:{children : React.ReactNode}) => {
 
 
    return (
   
    <main className='background-light850_dark100 relative'>

        <Navbar />  

        <div>

            LeftSidebar 

            <section className='flex bg-black min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14 '>

                <div className='mx-auto w-full max-w-5xl'>
                    {children}
                </div>

            </section>


            RightSidebar
        </div>
            Toaster 
            {/* //notification popup */}
    </main>
  )
}

export default Layout

// import LeftSidebar from "@/components/shared/LeftSidebar";
// import RightSidebar from "@/components/shared/RightSidebar";
// import NavBar from "@/components/shared/navbar/NavBar";

// import React from "react";

// const Layout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <main className="background-light850_dark100 relative">
//       <Navbar />
//       <div className="flex">
//         {/*import Navbar from "@/components/shared/navbar/Navbar"; <LeftSidebar /> */}
//         <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
//           <div className="mx-auto w-full max-w-5xl">{children}</div>
//         </section>
//         {/* <RightSidebar /> */}
//       </div>
//       Toaster
//     </main>
//   );
// };

// export default Layout;