import React from "react";
import styled from "styled-components";
import { FaGlobe } from "react-icons/fa";

const footerLinks = [
  ["FAQ", "Investor Relations", "Privacy", "Speed Test"],
  ["Help Centre", "Jobs", "Cookie Preferences", "Legal Notices"],
  ["Account", "Ways to Watch", "Corporate Information", "Contact Us"],
  ["Media Centre", "Terms of Use", "Device Support", "Only on Netflix"],
];

export default function Footer() {
  return (
    <FooterContainer>
      <div className="inner">
        <p className="phone">
          Questions? Call <a href="tel:0800-096-6341">0800-096-6341</a>
        </p>
        <LinksGrid>
          {footerLinks.map((column, i) => (
            <div key={i}>
              {column.map((link) => (
                <a key={link} href="#">
                  {link}
                </a>
              ))}
            </div>
          ))}
        </LinksGrid>
        <LangButton>
          <FaGlobe />
          English
        </LangButton>
        <p className="copyright">&copy; Netflix pakistan</p>
      </div>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  background-color: #141414;
  padding: 3rem 4%;
  color: #757575;
  font-size: 0.85rem;

  .inner {
    max-width: 1000px;
    margin: 0 auto;
  }

  .phone {
    margin-bottom: 1.5rem;

    a {
      color: #757575;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #fff;
      }
    }
  }

  .copyright {
    margin-top: 1.5rem;
  }
`;

const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  a {
    display: block;
    color: #757575;
    text-decoration: none;
    padding: 0.3rem 0;
    transition: color 0.2s ease;

    &:hover {
      color: #fff;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const LangButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  color: #757575;
  border: 1px solid #757575;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: #fff;
    border-color: #fff;
  }
`;
