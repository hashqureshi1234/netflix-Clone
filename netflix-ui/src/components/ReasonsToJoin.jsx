import React from "react";
import styled from "styled-components";
import { MdTv } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { HiOutlineDeviceMobile } from "react-icons/hi";
import { BsPeople } from "react-icons/bs";

const reasons = [
  {
    title: "Enjoy on your TV",
    description:
      "Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.",
    icon: <MdTv />,
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #000 100%)",
  },
  {
    title: "Download your shows",
    description:
      "Save your favourites easily and always have something to watch.",
    icon: <FiDownload />,
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #000 100%)",
  },
  {
    title: "Watch everywhere",
    description:
      "Stream unlimited movies and TV shows on your phone, tablet, laptop and TV.",
    icon: <HiOutlineDeviceMobile />,
    gradient: "linear-gradient(135deg, #581c87 0%, #000 100%)",
  },
  {
    title: "Create profiles for kids",
    description:
      "Send children on adventures with their favourite characters in a space made just for them — free with your membership.",
    icon: <BsPeople />,
    gradient: "linear-gradient(135deg, #1f2937 0%, #000 100%)",
  },
];

export default function ReasonsToJoin() {
  return (
    <Section>
      <h2>More Reasons to Join</h2>
      <Grid>
        {reasons.map((reason) => (
          <Card key={reason.title} $gradient={reason.gradient}>
            <div className="text">
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </div>
            <div className="icon">{reason.icon}</div>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}

const Section = styled.section`
  padding: 3rem 4%;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 1.25rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${({ $gradient }) => $gradient};
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 220px;

  .text {
    h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 0.85rem;
      color: #b3b3b3;
      line-height: 1.4;
    }
  }

  .icon {
    align-self: flex-end;
    margin-top: 1rem;

    svg {
      font-size: 2.5rem;
      color: #e50914;
    }
  }
`;
