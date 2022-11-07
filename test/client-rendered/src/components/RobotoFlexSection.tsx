import React from "react";
import styled from "styled-components";
import g from "../gfont";

const StyledDiv = styled.div`
  width: 800px;
  margin: 0 auto;
  h2 {
    font-size: 1.6rem;
  }
  p {
    font-size: 1rem;
    ${g.font("Roboto Flex", "sans-serif", "400", "opsz:22.2").css}
  }
  .all-digits {
    ${g.font("Roboto Flex", "sans-serif", "medium", "GRAD:100").css}
  }
  .all-caps {
    ${g.font("Roboto Flex", "sans-serif", "600", "slnt:-5").css}
  }
`;

export default function RobotoFlexSection() {
  return (
    <StyledDiv>
      <h2 style={{ ...g.font("Roboto Flex", "sans-serif", "semibold", "wdth:130.0", "slnt:-5", "opsz:22.2", "GRAD:100").obj }}>Roboto Flex</h2>
      <p className="all-small">the quick brown fox jumps over the lazy dog</p>
      <p className="all-digits">0123456789</p>
      <p className="all-caps">ABC DEF GHI JKL MNO PQRS TUV WXYZ</p>
    </StyledDiv>
  );
}
