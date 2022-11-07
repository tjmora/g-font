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
    ${g.font("Raleway", "sans-serif", "regular").css}
  }
  .all-caps {
    ${g.font("Raleway", "sans-serif", "300").css}
  }
`;

export default function RalewaySection() {
  return (
    <StyledDiv>
      <h2 style={{ ...g.font("Raleway", "sans-serif", "700").obj }}>Raleway</h2>
      <p className="all-small">the quick brown fox jumps over the lazy dog</p>
      <p className="all-digits">0123456789</p>
      <p className="all-caps">ABC DEF GHI JKL MNO PQRS TUV WXYZ</p>
    </StyledDiv>
  );
}
