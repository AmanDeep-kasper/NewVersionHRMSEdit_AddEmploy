import styled from "styled-components";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const KSidebar = styled.nav`
    min-height: 100vh;
    max-height: 100vh;
    min-width: 200px;
    max-width: 500px;
    width: 200px;
    background: ${(props) => props.darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)"};
    position: absolute;
    top: -2rem;
    left: 0;
    z-index: 2002;
    transition: 1s;
    transform: ${(props) => props.Open !== "Open" ? "translateX(0%)" : "translateX(-100%)"};
`;

export const TopKSidebar = styled.nav`
    min-height: 300px;
    max-height: 300px;
    min-width: 100%;
    max-width: 100%;
    width: 100%;
    background: ${(props) => props.darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)"};
    position: absolute;
    top: -2rem;
    left: 0;
    z-index: 2002;
    transition: 1s;
    transform: ${(props) => props.Open !== "Open" ? "translateY(0%)" : "translateY(-100%)"};
`;

export const BottomKSidebar = styled.nav`
    min-height: 300px;
    max-height: 300px;
    min-width: 100%;
    max-width: 100%;
    width: 100%;
    background: ${(props) => props.darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)"};
    position: absolute;
    bottom: 2rem;
    z-index: 2002;
    left: 0;
    transition: 1s;
    transform: ${(props) => props.Open !== "Open" ? "translateY(0%)" : "translateY(100%)"};
`;

export const RightKSidebar = styled.nav`
    min-height: 100vh;
    max-height: 100vh;
    min-width: 200px;
    max-width: 400px;
    width: fit-content;
    position: absolute;
    background: ${(props) => props.darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)"};
    top: 0;
    border-left: 1px solid rgba(0, 0, 0, .2);
    right: 0;
    z-index: 2002;
    padding: 1rem;
    transition: 1s;
    transform: ${(props) => props.Open !== "Open" ? "translateX(0%)" : "translateX(100%)"};
`;

export default function SidebarWrapper({ Open }) {
    const { darkMode } = useTheme();
    return <KSidebar Open={Open} darkMode={darkMode} />;
}
