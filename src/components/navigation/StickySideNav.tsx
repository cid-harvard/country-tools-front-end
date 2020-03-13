import React, {useContext, useState} from 'react';
import {
  NavContainer,
  gridSmallMediaWidth,
} from '../../styling/Grid';
import styled from 'styled-components';
import {
  baseColor,
  secondaryFont,
} from '../../styling/styleUtils';
import { AppContext } from '../../App';

export const mobileHeight = 50; // in px

const Ul = styled.ul`
  position: sticky;
  top: 0;
  background-color: #fff;
  margin: 0;
  padding: 0 0 0 1.3rem;
  list-style: none;
  text-align: right;

  @media (max-width: ${gridSmallMediaWidth}px) {
    height: ${mobileHeight}px;
    padding: 0;
  }
`;

const Link = styled.a`
  padding: 0.4rem;
  height: 1.9rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: var(--background-color);
  text-decoration: none;
  text-transform: uppercase;
  color: ${baseColor};
  font-family: ${secondaryFont};
  font-size: 0.8rem;
  letter-spacing: 1px;

  &:after {
    content: '';
    display: block;
    height: 100%;
    width: 0.35rem;
    margin-left: 0.35rem;
    background-color: var(--hover-color);
  }

  &:hover {
    background-color: var(--hover-color);
    &:after {
      background-color: var(--border-color);
    }
  }


  @media (max-width: ${gridSmallMediaWidth}px) {
    flex-direction: row-reverse;
    &:after {
      margin-right: 0.35rem;
    }
  }
`;

const MobileMenuButton = styled.button`
  background-color: var(--background-color);
  border: none;
  text-transform: uppercase;
  width: 100%;
  height: ${mobileHeight}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;

  &:hover {
    cursor: pointer;
    background-color: var(--hover-color);
  }
`;

const Icon = styled.span`
  display: flex;
  width: 20px;
  height: 16px;
  margin-right: 1rem;
  flex-direction: column;
  justify-content: space-between;
`;
const Bar = styled.span`
  display: inline-block;
  width: 100%;
  height: 0;
  border-top: 2px solid ${baseColor};
  transition: all 0.2s ease;
`;
const CenterBar = styled(Bar)`
  position: relative;

  &:before {
    content: '';
    display: inline-block;
    width: 100%;
    height: 0;
    border-top: 2px solid ${baseColor};
    position: absolute;
    transform-origin: center;
    top: -2px;
    left: 0;
    transition: all 0.2s ease;
  }

  &.close__menu {
    transform: rotate(45deg);

    &:before {
      transform: rotate(90deg);
    }
  }
`;

// Allow CSS custom properties
declare module 'csstype' {
  interface Properties {
    '--background-color'?: string;
    '--hover-color'?: string;
    '--border-color'?: string;
  }
}

export interface NavItem {
  label: string;
  target: string;
}

interface Props {
  links: NavItem[];
  backgroundColor: string;
  hoverColor: string;
  borderColor: string;
}


const StickySideNav = (props: Props) => {
  const { links, backgroundColor, hoverColor, borderColor } = props;

  const { windowWidth } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const colorTheme: React.CSSProperties = {
    '--background-color': backgroundColor,
    '--hover-color': hoverColor,
    '--border-color': borderColor,
  };
  const navLinks = links.map(({label, target}) => {
    return (
      <li key={label + target}>
        <Link
          href={target}
          style={colorTheme}
        >
          {label}
        </Link>
      </li>
    );
  });

  if (windowWidth > gridSmallMediaWidth) {
    return (
      <NavContainer>
        <Ul>
          {navLinks}
        </Ul>
      </NavContainer>
    );
  } else {
    const mobileMenu = mobileMenuOpen === false ? null : (
      <Ul
        onClick={() => setMobileMenuOpen(false)}
      >
        {navLinks}
      </Ul>
    );
    return (
      <NavContainer>
        <MobileMenuButton
          style={colorTheme}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Icon>
            <Bar style={{opacity: mobileMenuOpen ? 0 : undefined}} />
            <CenterBar className={mobileMenuOpen ? 'close__menu' : undefined} />
            <Bar style={{opacity: mobileMenuOpen ? 0 : undefined}} />
          </Icon>
          Menu
        </MobileMenuButton>
        {mobileMenu}
      </NavContainer>
    );
  }
};

export default StickySideNav;