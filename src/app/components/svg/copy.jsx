import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg``;

const CopyIcon = props => (
  <SVG
    viewBox="0 0 14 16"
    {...props}
  >
    <path
      d="M12.022 11.986v-.978c.55 0 .995-.446.996-.995l.005-8.005c0-.54-.446-.995-.997-.995h-7c-.552 0-1 .446-1 .995v.006h-1v-.008c0-1.108.897-2.006 2-2.006H12c1.104 0 2 .9 2 2.006V9.98c0 1.1-.886 1.995-1.978 2.006zM0 5.02c0-1.105.9-2 1.992-2.003l7.014-.01c1.1-.003 1.99.89 1.99 1.998v8.993c0 1.106-.898 2.002-1.99 2.002H1.992C.892 16 0 15.108 0 14V5.02zm1.01-.01v9.002c0 .55.447.995.997.995h6.998c.55 0 .996-.445.996-.995V5.01c0-.55-.445-.995-.995-.995H2.007c-.55 0-.996.445-.996.995z"
      fillRule="evenodd"
    />
  </SVG>
);

export default CopyIcon;
