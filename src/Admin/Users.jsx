import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Avatar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';


function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  if (!name) return {};
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 40,
      height: 40,
      fontSize: '1rem',
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1] ? name.split(' ')[1][0] : ''}`,
  };
}

function Users() {
  const [localUsers, setLocalUsers] = useState([]);


  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const usersWithId = users.map((user, index) => ({
      ...user,
      id: user.id || Date.now() + index,
      blocked: user.blocked || false,
    }));
    setLocalUsers(usersWithId);
    localStorage.setItem('users', JSON.stringify(usersWithId));
  }, []);


  const blockUser = (id) => {
    const updated = localUsers.map((user) =>
      user.id === id ? { ...user, blocked: !user.blocked } : user
    );
    setLocalUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));

    const toggleUser = updated.find((user) => user.id === id);
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));

    if (toggleUser.blocked && isLoggedIn?.email === toggleUser?.email) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('cart');
    }
  };



  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          mb: 3,
          color: 'black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <GroupIcon fontSize="medium" />
        User List
      </Typography>

      <TableContainer
        sx={{
          border: '1px solid #ddd',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 650, borderCollapse: 'separate', borderSpacing: 0 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                User Name
              </TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                <EmailIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Email
              </TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                <PublicIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Country
              </TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localUsers.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  '&:hover': { backgroundColor: '#f9f9f9', cursor: 'pointer' },
                  borderBottom: '1px solid #eee',
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar {...stringAvatar(user.userName)} />
                    <Typography>{user.userName || 'N/A'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography>{user.email || 'N/A'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PublicIcon fontSize="small" color="action" />
                    <Typography>{user.country || 'N/A'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip >
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => blockUser(user.id)}
                      aria-label={`${user.blocked ? 'unblock' : 'block'} user ${user.userName}`}
                    >
                      <Typography sx={{ color: user.blocked ? 'gray' : 'inherit' }}>
                        {user.userName || 'N/A'} {user.blocked && '(Blocked)'}
                      </Typography>

                      {user.blocked ? <LockOpenIcon /> : <BlockIcon />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {localUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, fontStyle: 'italic' }}>
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Users;