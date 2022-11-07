import React from "react";
import router from "next/router";

export default function SectionSwitcher({children}: {children?: React.ReactNode}) {
  return (
    <div style={{textAlign: "center"}}>
      <button onClick={()=>router.push("/")}>Roboto</button>
      <button onClick={()=>router.push("/lato")}>Lato</button>
      <button onClick={()=>router.push("/raleway")}>Raleway</button>
      <button onClick={()=>router.push("/playfair_display")}>Playfair Display</button>
      <button onClick={()=>router.push("/lora")}>Lora</button>
      <button onClick={()=>router.push("/roboto_flex")}>Roboto_Flex</button>
      {children}
    </div>
  )
}