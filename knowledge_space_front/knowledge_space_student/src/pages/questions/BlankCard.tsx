import { Card } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useCustomizerStore } from '@stores/customizerStore';

type Props = {
  className?: string;
  children: JSX.Element | JSX.Element[];
  sx?: any;
};

const BlankCard = ({ children, className, sx }: Props) => {
  // const customizer = useSelector((state: AppState) => state.customizer);
  const isCardShadow = useCustomizerStore((state) => state.isCardShadow);

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <Card
      sx={{
        p: 0,
        border: !isCardShadow ? `1px solid ${borderColor}` : 'none',
        position: 'relative',
        sx,
      }}
      className={className}
      elevation={isCardShadow ? 9 : 0}
      variant={!isCardShadow ? 'outlined' : undefined}
    >
      {children}
    </Card>
  );
};

export default BlankCard;
