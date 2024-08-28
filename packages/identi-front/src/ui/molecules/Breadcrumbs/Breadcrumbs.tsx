import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Breadcrumbs, Link, LinkProps, styled } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useTheme } from '@mui/material/styles';

export type BreadcrumbItem = {
  component: string | React.ReactNode;
  path?: string;
  onClick?: () => void; // solo funcionara en caso path este undefined
};

type BreadcrumbsComponentProps = {
  breadcrumbs?: BreadcrumbItem[];
};

const LinkTextActive = styled(Link)<LinkProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '14px'
}));

const LinkText = styled(Link)<LinkProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.primary.main,
  fontSize: '14px',
  fontWeight: 400,
  textDecoration: 'none !important'
}));

type prevNavigation = {
  module: string;
};

const BreadcrumbsComponent: React.FC<BreadcrumbsComponentProps> = (props: BreadcrumbsComponentProps) => {
  const history = useNavigate();
  const { state }: { state: prevNavigation } = useLocation();
  const theme = useTheme();
  const { breadcrumbs } = props;

  const handleOnClick = useCallback(
    (event: React.SyntheticEvent, path?: string) => {
      event.preventDefault();
      if (path !== undefined) history(path);
    },
    [history]
  );

  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" style={{ color: `${theme.palette.primary.main}` }} />}
      >
        {breadcrumbs?.map((breadcrumbItem: BreadcrumbItem, index: number) => {
          if (index === 1 && state && state.module) {
            return (
              <LinkTextActive
                color="inherit"
                key={`${state.module}_breadcrumb`}
                href="#"
                onClick={() => {
                  history(-1);
                }}
              >
                {state.module}
              </LinkTextActive>
            );
          }

          if (breadcrumbItem.path !== undefined) {
            return (
              <LinkTextActive
                key={`${index}_breadcrumb`}
                color="inherit"
                href="#"
                onClick={(event: React.SyntheticEvent) => handleOnClick(event, breadcrumbItem.path)}
              >
                {breadcrumbItem.component}
              </LinkTextActive>
            );
          }
          if (breadcrumbItem.onClick !== undefined) {
            return (
              <LinkTextActive key={`${index}_breadcrumb`} color="inherit" href="#" onClick={breadcrumbItem.onClick}>
                {breadcrumbItem.component}
              </LinkTextActive>
            );
          }
          return (
            <LinkText color="inherit" key={`${index}_breadcrumb`} variant="inherit">
              {breadcrumbItem.component}
            </LinkText>
          );
        })}
      </Breadcrumbs>
    </>
  );
};

// onClick={breadcrumbItem.onClick}

export default React.memo(BreadcrumbsComponent);
