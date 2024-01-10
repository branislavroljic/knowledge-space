import { FC } from "react";
import { Link } from "react-router-dom";
import LogoDark from "/src/assets/images/logos/dark-logo.svg?react";
import LogoLight from "/src/assets/images/logos/light-logo.svg?react";
import { styled } from "@mui/material";
import { useCustomizerStore } from "@stores/customizerStore";

const Logo: FC = () => {
  const customizer = useCustomizerStore();
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? "40px" : "180px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
  }));

  // if (customizer.activeDir === 'ltr') {
  return (
    <LinkStyled to="/">
      {customizer.activeMode === "dark" ? <LogoLight /> : <LogoDark />}
    </LinkStyled>
  );
  // }

  // return (
  //   <LinkStyled to="/">
  //     {customizer.activeMode === 'dark' ? (
  //       <LogoDarkRTL />
  //     ) : (
  //       <LogoLightRTL  />
  //     )}
  //   </LinkStyled>
  // );
};

export default Logo;
