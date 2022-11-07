import React, { useState } from "react";
import LatoSection from './LatoSection';
import LoraSection from './LoraSection';
import PlayfairDisplaySection from './PlayfairDisplaySection';
import RalewaySection from './RalewaySection';
import RobotoFlexSection from "./RobotoFlexSection";
import RobotoSection from "./RobotoSection";

export default function SectionSwitcher() {
  const [idx, setIdx] = useState(0);

  return (
    <div style={{textAlign: "center"}}>
      <button onClick={()=>setIdx(0)}>Roboto</button>
      <button onClick={()=>setIdx(1)}>Lato</button>
      <button onClick={()=>setIdx(2)}>Raleway</button>
      <button onClick={()=>setIdx(3)}>Playfair Display</button>
      <button onClick={()=>setIdx(4)}>Lora</button>
      <button onClick={()=>setIdx(5)}>Roboto Flex</button>
      {(() => {
        switch (idx) {
          case 0:
            return <RobotoSection />
          case 1:
            return <LatoSection />
          case 2:
            return <RalewaySection />
          case 3:
            return <PlayfairDisplaySection />
          case 4:
            return <LoraSection />
          default:
            return <RobotoFlexSection />
        }
      })()}
    </div>
  )
}