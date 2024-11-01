import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { getStats } from 'api/dashboard';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const offsetOptionsDay = [
  { value: 0, label: 'Today' },
];

const offsetOptionsWeek = [
  { value: 0, label: 'Week Present' },
  { value: 1, label: '1 Week Ago' },
  { value: 2, label: '2 Weeks Ago' },
  { value: 3, label: '3 Weeks Ago' },
  { value: 4, label: '4 Weeks Ago' }
];

const offsetOptionsMonth = [
  { value: 0, label: 'Month Present' },
  { value: 1, label: '1 Month Ago' },
  { value: 2, label: '2 Months Ago' },
  { value: 3, label: '3 Months Ago' },
  { value: 6, label: '6 Months Ago' }
];

const offsetOptionsYear = [
  { value: 0, label: 'Year Present' },
  { value: 1, label: '1 Year Ago' },
  { value: 2, label: '2 Years Ago' },
  { value: 3, label: '3 Years Ago' }
];

const EarningCard = ({ isLoading }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [period, setPeriod] = useState('week');
  const [offset, setOffset] = useState(0);
  const [offsetOptions, setOffsetOptions] = useState(offsetOptionsWeek);
  const [income, setIncome] = useState(0);
  const [loadingData, setLoadingData] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePeriodSelect = (newPeriod) => {
    setPeriod(newPeriod);
    handleClose();

    // Update offset options based on the selected period
    if (newPeriod === 'week') {
      setOffsetOptions(offsetOptionsWeek);
    } else if (newPeriod === 'month') {
      setOffsetOptions(offsetOptionsMonth);
    } else if (newPeriod === 'year') {
      setOffsetOptions(offsetOptionsYear);
    } else if (newPeriod === 'day') {
      setOffsetOptions(offsetOptionsDay);
    }
    setOffset(0); // Reset offset to 0 when period changes
  };

  const handleOffsetChange = (event) => {
    setOffset(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (period) {
        setLoadingData(true);
        try {
          const response = await getStats({ period, offset });
          console.log(response);
          setIncome(response.totalRevenue);
        } catch (error) {
          console.error('Error fetching stats:', error);
        } finally {
          setLoadingData(false);
        }
      }
    };

    fetchData();
  }, [period, offset]);

  return (
    <>
      {isLoading || loadingData ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: 'secondary.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.secondary[800],
              borderRadius: '50%',
              top: { xs: -105, sm: -85 },
              right: { xs: -140, sm: -95 },
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.secondary[800],
              borderRadius: '50%',
              top: { xs: -155, sm: -125 },
              right: { xs: -70, sm: -15 },
              opacity: 0.5,
            },
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        bgcolor: 'secondary.800',
                        mt: 1,
                      }}
                    >
                      <img src={EarningIcon} alt="Notification" />
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <FormControl sx={{ minWidth: 150 }}>
                      <Select
                        value={offset}
                        onChange={handleOffsetChange}
                        label="Offset"
                      >
                        {offsetOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        bgcolor: 'secondary.dark',
                        color: 'secondary.200',
                        zIndex: 1,
                      }}
                      aria-controls="menu-earning-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <MoreHorizIcon fontSize="inherit" />
                    </Avatar>
                    <Menu
                      id="menu-earning-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <MenuItem onClick={() => handlePeriodSelect('day')}>Day</MenuItem>
                      <MenuItem onClick={() => handlePeriodSelect('week')}>Week</MenuItem>
                      <MenuItem onClick={() => handlePeriodSelect('month')}>Month</MenuItem>
                      <MenuItem onClick={() => handlePeriodSelect('year')}>Year</MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography
                      sx={{
                        fontSize: '2.125rem',
                        fontWeight: 500,
                        mr: 1,
                        mt: 1.75,
                        mb: 0.75,
                      }}
                    >
                      {income}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar
                      sx={{
                        cursor: 'pointer',
                        ...theme.typography.smallAvatar,
                        bgcolor: 'secondary.200',
                        color: 'secondary.dark',
                      }}
                    >
                      <ArrowUpwardIcon
                        fontSize="inherit"
                        sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }}
                      />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: 'secondary.200',
                  }}
                >
                  Total Income
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default EarningCard;