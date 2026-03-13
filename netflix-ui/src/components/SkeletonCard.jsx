import React from "react";
import styled, { keyframes } from "styled-components";

export default function SkeletonCard() {
  return (
    <Container>
      <div className="poster" />
    </Container>
  );
}

const shimmer = keyframes`
  0% { background-position: -230px 0; }
  100% { background-position: 230px 0; }
`;

const Container = styled.div`
  min-width: 230px;
  width: 230px;
  .poster {
    width: 100%;
    height: 130px;
    border-radius: 0.2rem;
    background: linear-gradient(
      90deg,
      #1a1a1a 25%,
      #2a2a2a 50%,
      #1a1a1a 75%
    );
    background-size: 460px 100%;
    animation: ${shimmer} 1.5s infinite linear;
  }
`;
