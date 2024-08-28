import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';

const GlobalStyles = () => {
  const theme = useTheme();

  useEffect(() => {
    // Apply global styles using vanilla CSS or JavaScript
    const globalStyles = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html, body, #root {
        width: 100%;
        height: 100%;
      }
      body {
        -ms-text-size-adjust: 100%;
        -webkit-overflow-scrolling: touch;
      }
      input[type=number] {
        -moz-appearance: textfield;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          margin: 0;
          -webkit-appearance: none;
        }
      }
      textarea::-webkit-input-placeholder {
        color: ${theme.palette.text.disabled};
      }
      textarea::-moz-placeholder {
        opacity: 1;
        color: ${theme.palette.text.disabled};
      }
      textarea:-ms-input-placeholder {
        color: ${theme.palette.text.disabled};
      }
      textarea::placeholder {
        color: ${theme.palette.text.disabled};
      }
      a {
        color: ${theme.palette.primary.main};
      }
      img {
        display: block;
        max-width: 100%;
      }
      .blur-up {
        -webkit-filter: blur(5px);
        filter: blur(5px);
        transition: filter 400ms, -webkit-filter 400ms;
      }
      .blur-up.lazyloaded {
        -webkit-filter: blur(0);
        filter: blur(0);
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, [theme.palette.primary.main, theme.palette.text.disabled]);

  return null; // This component doesn't render anything, so return null
};

export default GlobalStyles;