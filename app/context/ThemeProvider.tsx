'use client'


import React , {createContext,useEffect,useState,useContext} from "react"


interface ThemeContextType {
    mode:string,
    setMode: (mode:string)=> void
}


const ThemeContext = createContext <ThemeContextType | undefined>(undefined);


export function ThemeProvider({children}:{children:React.ReactNode}){

   const [mode,setMode] = useState('')

    /**
 * Function to handle theme change based on user preference or stored theme setting.
 * If the user has a stored preference for 'dark' theme or if no theme is stored
 * and the user's system preference is 'dark', set the mode to 'dark' and apply
 * the 'dark' class to the HTML document element.
 * Otherwise, set the mode to 'light' and remove the 'dark' class from the HTML document element.
 */
   function handleThemeChange(){

    if(localStorage.theme === 'dark' || (!('theme 'in localStorage) && 
    window.matchMedia(("prefers-color-scheme:dark")).matches)){
        
        setMode("dark")
        // add class to the page
        document.documentElement.classList.add("dark")
    }else{
        setMode("light")

        document.documentElement.classList.remove("dark")

    }
   }

   useEffect(()=>{
        handleThemeChange()
   },[mode])

   return (
        <ThemeContext.Provider value={{mode,setMode}}>
            {children}
        </ThemeContext.Provider>
   )

}


export function useTheme(){

const context = useContext(ThemeContext)

if(context === undefined){
    throw new Error("useTheme must be used within a theme provider")
}

return context

}