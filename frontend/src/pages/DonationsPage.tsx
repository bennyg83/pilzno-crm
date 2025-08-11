import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { MonetizationOn } from '@mui/icons-material'

const DonationsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#4A148C', fontWeight: 600 }}>
        Donation Management
      </Typography>

      <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#FAFAFA', border: '2px dashed #4A148C' }}>
        <MonetizationOn sx={{ fontSize: 80, color: '#4A148C', mb: 2 }} />
        <Typography variant="h5" sx={{ color: '#4A148C', fontWeight: 600, mb: 2 }}>
          Donation Management Coming Soon
        </Typography>
        <Typography variant="body1" sx={{ color: '#7B1FA2', mb: 2 }}>
          Comprehensive donation and pledge management will be implemented in future phases.
        </Typography>
        <Typography variant="body2" sx={{ color: '#4A148C' }}>
          Features will include donation tracking, pledge management, receipts, 
          memorial donations, and financial reporting.
        </Typography>
      </Paper>
    </Box>
  )
}

export default DonationsPage 