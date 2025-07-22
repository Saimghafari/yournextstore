import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Stack,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  List,
  ListItem,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { ChartContainer } from '@mui/x-charts/ChartContainer';
import {
  LinePlot,
  MarkPlot,
  lineElementClasses,
  markElementClasses,
} from '@mui/x-charts/LineChart';
import { chartsTooltipClasses } from '@mui/x-charts/ChartsTooltip';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { checkOut } from '../Redux/CheckOutSlice';
import { useSelector } from 'react-redux';



function TinyLineChart({ data, color, width = 150, height = 60 }) {
  const xLabels = ['June', 'July', 'August', 'September', 'October', 'November',];

  return (
    <ChartContainer
      width={width}
      height={height}
      series={[{ type: 'line', data }]}
      xAxis={[{ scaleType: 'point', data: xLabels, position: 'none' }]}
      yAxis={[{ position: 'none' }]}
      disableAxisListener={false}
      sx={{
        [`& .${lineElementClasses.root}`]: {
          stroke: color,
          strokeWidth: 2,
        },
        [`& .${markElementClasses.root}`]: {
          display: 'none',
        },
        [`& .${chartsTooltipClasses.root}`]: {
          zIndex: 10,
        },
      }}
    >
      <LinePlot />
      <MarkPlot />
      <ChartsTooltip />
    </ChartContainer>
  );
}

const pieData = [
  { id: 0, value: 35, },
  { id: 1, value: 25, },
  { id: 2, value: 20, },
]

const pieDataTwo = [
  { id: 0, value: 35, label: 'Mens', color: '#22c55e' },
  { id: 1, value: 25, label: 'Womens', color: '#facc15' },
  { id: 2, value: 20, label: 'Kids', color: '#f87171' },
]

const total = pieData.reduce((sum, item) => sum + item.value, 0);

// const margin = { right: 24 };
const totalIncome = [4000, 3000, 2000, 2780, 1890, 2390,];
const totalExpensive = [2400, 1398, 9800, 3908, 4800, 3800,];
const xLabels = ['June', 'July', 'August', 'September', 'October', 'November',];

//  linear Progress bar 

const BorderLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'barColor',
})(({ theme, barColor }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles?.('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: barColor || '#1a90ff',
  },
}));


function Dashboard() {

  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  // console.log(orders);

  const values = [
    {
      text: 'Product sold',
      number: '765',
      week: '+2.6%',
      isPositive: true,
      chart: <TinyLineChart data={[80, 85, 75, 90, 82, 88]} color="#4caf50" />,
    },
    {
      text: 'Total balance',
      number: '18,765',
      week: '-0.1%',
      isPositive: false,
      chart: <TinyLineChart data={[100, 110, 95, 105, 90, 85]} color="#ffc107" />,
    },
    {
      text: 'Sales profit',
      number: '4,876',
      week: '+0.6%',
      isPositive: true,
      chart: <TinyLineChart data={[70, 75, 65, 80, 72, 78]} color="#ff5722" />,
    },
  ];

  return (
    <Box>
      <Box>
        <Grid container spacing={2} justifyContent='center' >
          {values.map((items, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: '#ffffff',
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    transform: 'translateY(-6px)',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex' }}>
                  <Box>
                    <Typography variant="body1" fontWeight="600" textAlign="left" mb={1}>
                      {items.text}
                    </Typography>
                    <Typography variant="h4" fontWeight="600" textAlign="left" mb={1} mt={2}>
                      {items.number}
                    </Typography>
                    <Box display="flex" alignItems="center" mb={1} mt={2}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: items.isPositive ? '#dcfce7' : '#fee2e2',
                          mr: 1,
                        }}
                      >
                        {items.isPositive ? (
                          <ArrowUpwardIcon sx={{ color: '#22c55e', fontSize: 16 }} />
                        ) : (
                          <ArrowDownwardIcon sx={{ color: '#ef4444', fontSize: 16 }} />
                        )}
                      </Avatar>
                      <Typography
                        variant="subtitle2"
                        fontWeight="600"
                        color={items.isPositive ? '#4caf50' : '#f44336'}
                        mr={0.5}
                      >
                        {items.week}
                      </Typography>

                      <Typography variant="subtitle2" fontWeight="lighter" color="gray" ml={0.5}>
                        last week
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ alignSelf: 'center', mt: 2 }}>
                    {items.chart}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 4,
          mt: 5,
        }}
      >
        {/* Pie Chart */}
        <Box sx={{
          width: {
            xs: '80%',
            sm: '100%',
            md: '100%',
            lg: '35%'
          },
          mx: 'auto'
        }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: '#ffffff',
              border: '1px solid #e0e0e0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',

            }}

          >
            {/* Pie Chart with center label */}
            <PieChart
              series={[
                {
                  data: pieData,
                  innerRadius: 60,
                  outerRadius: 80,
                  arcLabel: () => '',
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  cornerRadius: 5,
                  paddingAngle: 4,
                  startAngle: -90,
                  endAngle: 270,
                },
              ]}
              width={220}
              height={220}
              slotProps={{
                legend: { hidden: true },
              }}
            />


            <Box
              sx={{
                position: 'absolute',
                mt: '85px',
                textAlign: 'center',
                pointerEvents: 'none',

              }}
            >
              <Typography variant="body2" color="textSecondary">
                Total
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {total.toLocaleString()}
              </Typography>
            </Box>


            <Stack direction="row" spacing={3} mt={4}>
              {pieDataTwo.map((item) => (
                <Stack direction="row" alignItems="center" spacing={1} key={item.id}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: item.color,
                    }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {item.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Box>

        {/* Line Chart */}
        <Box
          sx={{
            width: {
              xs: '80%',
              sm: '100%',
              md: '100%',
              lg: '60%'
            },
            mx: 'auto'
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: '#ffffff',
              border: '1px solid #e0e0e0',
            }}
          >
            <LineChart
              height={300}
              series={[
                { data: totalIncome, label: 'Total Income' },
                { data: totalExpensive, label: 'Total Expensive' },
              ]}
              xAxis={[{ scaleType: 'point', data: xLabels }]}
              yAxis={[{ width: 50 }]}
            />
          </Paper>
        </Box>
      </Box>



      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        mt: 5,
      }}>

        {/* Progress Bar */}


        <Box
          sx={{
            width: {
              xs: '80%',
              sm: '100%',
              md: '100%',
              lg: '70%'
            },
            mx: 'auto'
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: '#ffffff',
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontWeight: 'bold',
                fontSize: {
                  xs: '1rem',
                  sm: '1.2rem',
                  md: '1.5rem',
                },
              }}
            >
              Sales Overview
            </Typography>

            {/* Total Profit */}
            <Box sx={{ mt: 5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Typography
                  variant='body2'
                  sx={{
                    fontWeight: 'bold',
                    color: 'black',
                    mb: 2,
                    fontSize: {
                      xs: '0.9rem',
                      sm: '1rem',
                      md: '1.1rem',
                    },
                  }}
                >
                  Total profit
                </Typography>
                <Typography
                  sx={{
                    fontSize: {
                      xs: '0.9rem',
                      sm: '1rem',
                      md: '1.1rem',
                    },
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>$8,374</span>
                  <span style={{ color: 'gray' }}> (10.1%)</span>
                </Typography>
              </Box>
              <BorderLinearProgress variant="determinate" value={10} barColor="#4caf50" />
            </Box>

            {/* Total Income */}
            <Box sx={{ mt: 5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Typography
                  variant='body2'
                  sx={{
                    fontWeight: 'bold',
                    color: 'black',
                    mb: 2,
                    fontSize: {
                      xs: '0.9rem',
                      sm: '1rem',
                      md: '1.1rem',
                    },
                  }}
                >
                  Total income
                </Typography>
                <Typography
                  sx={{
                    fontSize: {
                      xs: '0.9rem',
                      sm: '1rem',
                      md: '1.1rem',
                    },
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>$9,714</span>
                  <span style={{ color: 'gray' }}> (13.6%)</span>
                </Typography>
              </Box>
              <BorderLinearProgress variant="determinate" value={13.6} barColor="#2196f3" />
            </Box>

            {/* Total Expenses */}
            <Box sx={{ mt: 5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Typography
                  variant='body2'
                  sx={{
                    fontWeight: 'bold',
                    color: 'black',
                    mb: 2,
                    fontSize: {
                      xs: '0.9rem',
                      sm: '1rem',
                      md: '1.1rem',
                    },
                  }}
                >
                  Total expenses
                </Typography>
                <Typography
                  sx={{
                    fontSize: {
                      xs: '0.9rem',
                      sm: '1rem',
                      md: '1.1rem',
                    },
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>$6,871</span>
                  <span style={{ color: 'gray' }}> (28.2%)</span>
                </Typography>
              </Box>
              <BorderLinearProgress variant="determinate" value={28.2} barColor="#f44336" />
            </Box>
          </Paper>
        </Box>


        <Box
          sx={{
            width: {
              xs: '80%',
              sm: '100%',
              md: '100%',
              lg: '25%',

            },
            mx: 'auto',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: '#ffffff',
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
              Current Balance
            </Typography>

            <Typography variant='h4' sx={{ fontWeight: 'bold', mt: 3 }}>
              $187,650
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Typography sx={{ color: 'gray' }}>Order total</Typography>
              <Typography>$287,650</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Typography sx={{ color: 'gray' }}>Earning</Typography>
              <Typography>$25,500</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Typography sx={{ color: 'gray' }}>Refunded</Typography>
              <Typography>$1,600</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 3 }}>
              <Button
                sx={{
                  bgcolor: 'orange',
                  borderRadius: 2,
                  px: 2,
                  color: 'black',
                  fontSize: { xs: '0.75rem', sm: '1rem', md: '1rem', lg: '0.75rem' },
                  '&:hover': { bgcolor: '#ff5722' },

                }}
              >
                Request
              </Button>
              <Button
                sx={{
                  bgcolor: '#388e3c',
                  borderRadius: 2,
                  px: 2,
                  color: 'black',
                  fontSize: { xs: '0.75rem', sm: '1rem', md: '1rem', lg: '0.75rem' },
                  '&:hover': { bgcolor: '#1b5e20' },
                }}
              >
                Transfer
              </Button>
            </Box>
          </Paper>
        </Box>

      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <Box sx={{
          width: {
            xs: '80%',
            sm: '100%',
            md: '100%',
            lg: '70%'
          },
          mx: 'auto'
        }}>
          <TableContainer sx={{ mt: 4, boxShadow: 3, borderRadius: 2, overflowX: 'auto' }}>
            <Table stickyHeader>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Contact No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Country</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{item.userDetails.fullName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.primary">{item.userDetails.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.primary">{item.userDetails.contactNo}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.primary">{item.userDetails.countryRegion}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box width="25%" mt={4} sx={{
          width: {
            xs: '80%',
            sm: '100%',
            md: '100%',
            lg: '25%',

          },
          mx: 'auto',
        }}>
          {orders.length > 0 ? (
            orders.map((item, index) => (
              <List key={index} sx={{ mb: 2, p: 2, boxShadow: 3, borderRadius: 2, bgcolor: '#fff' }}>
                {item.cartItems?.map((cartItem, cartIndex) => (
                  <ListItem key={cartIndex} sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      {/* Left side: image and title */}
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box
                          component="img"
                          src={cartItem.image}
                          alt={cartItem.title}
                          sx={{
                            width: 56,
                            height: 56,
                            objectFit: 'cover',
                            borderRadius: 2,
                            border: '1px solid #e0e0e0',
                            backgroundColor: '#fafafa',
                          }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {cartItem.title || 'No Title'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {cartItem.quantity || 0}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Right side: price */}
                      <Typography variant="subtitle2" fontWeight={600} color="primary">
                        ${cartItem.price?.toFixed(2) || '0.00'}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ))
          ) : (
            <Typography textAlign="center" color="text.secondary" mt={4}>
              No orders available
            </Typography>
          )}
        </Box>


      </Box>

    </Box>
  );
}

export default Dashboard;
