import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Stack,
    InputBase,
    Menu,
    MenuItem,
    Badge,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, Link } from 'react-router-dom';
import DrawerProduct from '../Components/DrawerProduct';
import { useSelector } from 'react-redux';
import { useSearch } from '../Context/SearchContext';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.25),
    },
    marginLeft: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: 'auto',
    },
    [theme.breakpoints.down('md')]: {
        flexGrow: 1,
    },
    border: '1px solid black',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    right: 0,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'black',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 2),
        paddingRight: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        minWidth: '15ch',
        maxWidth: '30ch',
        [theme.breakpoints.up('md')]: {
            minWidth: '20ch',
            maxWidth: '25ch',
        },
    },
}));

function Navbar({ isLoggedIn, setIsLoggedIn }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const { searchData, handleInputChange } = useSearch();
    const { totalQuantity } = useSelector((state) => state.cart);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const removeUser = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const toggleDrawerOpen = (newOpen) => () => {
        if (newOpen) {
            setDrawerOpen(false); // Close navigation drawer when opening cart
        }
        setOpenDrawer(newOpen);
    };

    const toggleDrawer = (open) => () => {
        if (open) {
            setOpenDrawer(false); // Close cart drawer when opening navigation
        }
        setDrawerOpen(open);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSearchIconClick = () => {
        setSearchActive(true);
    };

    const handleSearchBlur = () => {
        if (!searchData) {
            setSearchActive(false);
        }
    };

    const handleSearchClear = () => {
        handleInputChange({ target: { value: '' } });
        setSearchActive(false);
    };

    const menuItems = [
        { label: 'Home', path: '/' },
        { label: 'Apparel', path: '/apparel' },
        { label: 'Accessories', path: '/accessories' },
        { label: 'Digital', path: '/digital' },
    ];

    return (
        <>
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'white' }}>
                <Toolbar sx={{ justifyContent: 'space-between', paddingLeft: 0, paddingRight: 0 }}>
                    {/* Left Section (Title and Menu Items) */}
                    <Box
                        sx={{
                            display: {
                                xs: searchActive ? 'none' : 'flex',
                                sm: searchActive ? 'none' : 'flex',
                                md: 'flex',
                            },
                            alignItems: 'center',
                        }}
                    >
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                color="black"
                                sx={{
                                    fontSize: { xs: '1rem', sm: '1.25rem' },
                                    textAlign: { xs: 'center', sm: 'left' },
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Your Next Store
                            </Typography>
                        </Link>

                        {/* Menu items */}
                        <Stack
                            spacing={1}
                            direction="row"
                            sx={{
                                display: {
                                    xs: 'none',
                                    sm: searchActive ? 'none' : 'flex',
                                    md: 'flex',
                                },
                            }}
                        >
                            {menuItems.map((item, index) => (
                                <Button
                                    key={index}
                                    variant="text"
                                    component={Link}
                                    to={item.path}
                                    sx={{ color: 'black', fontWeight: 'bold' }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Stack>
                    </Box>

                    {/* Right Section (Search + Icons + Mobile Menu) */}
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                            flexGrow: { xs: searchActive ? 1 : 0, sm: searchActive ? 1 : 0, md: 0 },
                        }}
                    >
                        {/* Search Bar or Icon */}
                        {searchActive || isMdUp ? (
                            <Search
                                sx={{
                                    display: { xs: 'flex', sm: 'flex', md: 'flex' },
                                    width: {
                                        xs: searchActive ? '100%' : 'auto',
                                        sm: searchActive ? '100%' : 'auto',
                                        md: 'auto',
                                    },
                                }}
                            >
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    value={searchData}
                                    onChange={handleInputChange}
                                    onBlur={handleSearchBlur}
                                    autoFocus={searchActive}
                                    inputProps={{ 'aria-label': 'Search products' }}
                                />
                                {searchActive && (
                                    <IconButton
                                        onClick={handleSearchClear}
                                        sx={{ position: 'absolute', right: 0 }}
                                        aria-label="Clear search"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                )}
                            </Search>
                        ) : (
                            <IconButton
                                onClick={handleSearchIconClick}
                                sx={{ ml: 1 }}
                                aria-label="Open search"
                            >
                                <SearchIcon />
                            </IconButton>
                        )}

                        {/* Icons */}
                        <Box
                            sx={{
                                display: {
                                    xs: searchActive ? 'none' : 'flex',
                                    sm: searchActive ? 'none' : 'flex',
                                    md: 'flex',
                                },
                                gap: { xs: 0.5, sm: 1 },
                            }}
                        >
                            <IconButton sx={{ p: { xs: 0.5, sm: 1, }, ml: { lg: 2 } }} aria-label="View cart">
                                <Badge
                                    badgeContent={totalQuantity}
                                    color="error"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                            minWidth: { xs: '16px', sm: '20px' },
                                            height: { xs: '16px', sm: '20px' },
                                        },
                                    }}
                                >
                                    <LocalMallRoundedIcon onClick={toggleDrawerOpen(true)} />
                                </Badge>
                                <DrawerProduct
                                    openDrawer={openDrawer}
                                    toggleDrawerOpen={toggleDrawerOpen}
                                />
                            </IconButton>

                            {isLoggedIn ? (
                                <>
                                    <IconButton
                                        sx={{ p: { xs: 0.5, sm: 1 } }}
                                        aria-label="User profile"
                                        onClick={handleClick}
                                        id="user-menu-button"
                                        aria-controls={open ? 'user-menu' : undefined}
                                        aria-haspopup="true"
                                    >
                                        <PersonRoundedIcon />
                                    </IconButton>

                                    <Menu
                                        id="user-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        PaperProps={{
                                            sx: {
                                                borderRadius: 2,
                                                boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
                                                minWidth: 220,
                                                p: 1,
                                                mt: 1,
                                            },
                                        }}
                                    >
                                        <MenuItem sx={{ display: 'flex', gap: 1.5 }}>
                                            <AccountCircleRoundedIcon color="primary" />
                                            <Typography variant="body1" fontWeight="bold">
                                                {JSON.parse(localStorage.getItem('isLoggedIn'))?.userName || 'User'}
                                            </Typography>
                                        </MenuItem>

                                        <MenuItem sx={{ display: 'flex', gap: 1.5 }}>
                                            <EmailRoundedIcon color="action" />
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                {JSON.parse(localStorage.getItem('isLoggedIn'))?.email || 'Email'}
                                            </Typography>
                                        </MenuItem>

                                        <MenuItem
                                            onClick={() => {
                                                removeUser();
                                                handleClose();
                                            }}
                                            sx={{
                                                display: 'flex',
                                                gap: 1.5,
                                                mt: 0.5,
                                                '&:hover': {
                                                    bgcolor: 'error.main',
                                                    color: 'white',
                                                    '& svg': {
                                                        color: 'white',
                                                    },
                                                },
                                            }}
                                        >
                                            <LogoutRoundedIcon />
                                            <Typography variant="body2">Logout</Typography>
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <IconButton
                                    sx={{ p: { xs: 0.5, sm: 1 } }}
                                    onClick={() => navigate('/login')}
                                    aria-label="Log in"
                                >
                                    <PersonRoundedIcon />
                                </IconButton>
                            )}




                            {/* Hamburger Menu for xs and sm (when searchActive) */}
                            <Box
                                sx={{
                                    display: {
                                        xs: searchActive ? 'none' : 'flex',
                                        sm: searchActive ? 'flex' : 'none',
                                        md: 'none',
                                    },
                                }}
                            >
                                <IconButton
                                    onClick={toggleDrawer(true)}
                                    aria-label="Open navigation menu"
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer for Mobile Navigation */}
            <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        {menuItems.map((item, index) => (
                            <ListItem
                                button
                                style={{ color: 'black' }}
                                key={index}
                                component={Link}
                                to={item.path}
                            >
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}

export default Navbar;