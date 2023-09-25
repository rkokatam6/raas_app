import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { AppBar, IconButton, Toolbar, useMediaQuery, Typography } from '@mui/material';

// project import
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';

// assets
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const Header = ({ open, handleDrawerToggle, drawerToggleIsVisible }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  const iconBackColor = 'grey.100';
  const iconBackColorOpen = 'grey.200';

  // common header
  const mainHeader = (
    <Toolbar>
      {drawerToggleIsVisible && (
        <IconButton
          disableRipple
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          color="#FFFFFF"
          sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor, ml: { xs: 0, lg: -2 } }}
        >
          {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </IconButton>
      )}

      <HeaderContent />
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`
      // boxShadow: theme.customShadows.z1
    }
  };

  return (
    <>
      {!matchDownMD ? (
        <AppBarStyled open={open} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};

Header.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func
};

// ==============================|| MAIN LAYOUT - PAGE ||============================== //

const PageLayout = () => {
  return (
    <>
      <Header open={false} handleDrawerToggle={() => {}} drawerToggleIsVisible={true} />
      <box>

      
        <Typography variant="h4" sx={{ fontWeight: 600, mt: 5, mb: 2 }}>
          Land Selection
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 4 }}>
          Extra Text
        </Typography>
        </box>
        <main>
        <Typography variant="body1" sx={{ color: 'text.primary' }}>
          Main Content
        </Typography>
        
      </main>
      
    </>
  );
};

export default PageLayout;

