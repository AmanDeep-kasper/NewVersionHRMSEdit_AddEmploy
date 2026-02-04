import Styled from "styled-components"

const StyledButton = Styled.button`
    background: linear-gradient(165deg, var(--primary-light), var(--primary-dark));
    color:var(--light-color);
    font-size:1.2rem;
    padding:.2rem .6rem; 
    border:none;
    box-shadow: ${(props) => props.shadow === "shadow" ? "3px 3px 2px 1px rgba(0,0,0,.2)" : "none"};
    margin:1rem;
    border-radius: ${(props) => props.circle === "circle" ? "30px" : "0"};
    transition: .5s;
    cursor: pointer;
    `
export const DarkButton = Styled(StyledButton)`
background: var(--primaryDashColorDark);
color:var(--light-color);
`
export const RedButton = Styled(StyledButton)`
background: ${(props) => props.varient === "outline" ? "white" : "red"};
color: ${(props) => props.varient === "outline" ? "red" : "white"};
border:  ${(props) => props.varient === "outline" ? "2px solid red" : "2px solid white"}; 
&:hover {
    background: ${(props) => props.varient !== "outline" ? "white" : "red"};
color: ${(props) => props.varient !== "outline" ? "red" : "white"};
border:  ${(props) => props.varient !== "outline" ? "2px solid red" : "2px solid white"}; 
}
`
export const PurpleButton = Styled(StyledButton)`
background: ${(props) => props.varient === "outline" ? "white" : "purple"};
color: ${(props) => props.varient === "outline" ? "purple" : "white"};
border:  ${(props) => props.varient === "outline" ? "2px solid purple" : "2px solid white"};
&:hover {
    background: ${(props) => props.varient !== "outline" ? "white" : "purple"};
color: ${(props) => props.varient !== "outline" ? "purple" : "white"};
border:  ${(props) => props.varient !== "outline" ? "2px solid purple" : "2px solid white"};
}

`
export const PinkButton = Styled(StyledButton)`
background: ${(props) => props.varient === "outline" ? "white" : "pink"};
color: ${(props) => props.varient === "outline" ? "pink" : "white"};
border:  ${(props) => props.varient === "outline" ? "2px solid pink" : "2px solid white"};
&:hover {
    background: ${(props) => props.varient !== "outline" ? "white" : "pink"};
color: ${(props) => props.varient !== "outline" ? "pink" : "white"};
border:  ${(props) => props.varient !== "outline" ? "2px solid pink" : "2px solid white"};
}
`

export default StyledButton