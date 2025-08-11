import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  People,
  Star,
  Group,
  Phone,
  Email,
  Home,
  MonetizationOn
} from '@mui/icons-material'
import { toast } from 'react-hot-toast'
import { apiService } from '../services/apiService'
import FamilyFormDialog from '../components/FamilyFormDialog'
import { Family, FamilyFormData } from '../types'

const FamiliesPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingFamily, setEditingFamily] = useState<Family | null>(null)
  const [families, setFamilies] = useState<Family[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load families from API
  const loadFamilies = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiService.families.getAll()
      setFamilies(response.families || [])
      console.log('Loaded families from API:', response.families?.length || 0)
    } catch (error: any) {
      console.error('Error loading families:', error)
      setError('Failed to load families. Please try again.')
      // Show mock data as fallback if API fails
              setFamilies([
          {
            id: 'mock-1',
            familyName: 'Cohen (Mock Data)',
            hebrewFamilyName: 'כהן',
            primaryEmail: 'cohen@example.com',
            phone: '+972-50-123-4567',
            address: '123 Herzl Street',
            city: 'Tel Aviv',
            membershipStatus: 'member',
            familyHealth: 'Good',
            totalDonations: 0,
            memberCount: 4,
            annualPledge: 5000,
            currency: 'NIS',
            isFoundingFamily: true,
            isBoardFamily: false,
            createdAt: '2023-01-15'
          }
        ])
    } finally {
      setIsLoading(false)
    }
  }

  // Load families on component mount
  useEffect(() => {
    loadFamilies()
  }, [])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  const handleAddFamily = () => {
    setEditingFamily(null)
    setIsFormOpen(true)
  }

  const handleEditFamily = (family: Family) => {
    setEditingFamily(family)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingFamily(null)
  }

  const handleSaveFamily = async (data: FamilyFormData) => {
    try {
      if (editingFamily) {
        // Update existing family
        await apiService.families.update(editingFamily.id, data)
        toast.success('Family updated successfully!')
      } else {
        // Create new family
        await apiService.families.create(data)
        toast.success('Family created successfully!')
      }
      
      // Refresh family list after successful save
      await loadFamilies()
      
    } catch (error: any) {
      console.error('Error saving family:', error)
      const errorMessage = error.response?.data?.message || 'Failed to save family. Please try again.'
      toast.error(errorMessage)
      throw error // Re-throw to prevent dialog from closing on error
    }
  }

  const filteredFamilies = families.filter((family: Family) =>
    family.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.hebrewFamilyName?.includes(searchTerm) ||
    family.primaryEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'member': return '#43A047'
      case 'prospective': return '#FB8C00'
      case 'visitor': return '#1E88E5'
      case 'former': return '#757575'
      default: return '#757575'
    }
  }

  const formatCurrency = (amount: number, currency: 'USD' | 'NIS') => {
    const symbol = currency === 'USD' ? '$' : '₪'
    return `${symbol}${amount.toLocaleString()}`
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Family Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddFamily}
          sx={{ bgcolor: '#6A1B9A', '&:hover': { bgcolor: '#9C4DCC' } }}
        >
          Add Family
        </Button>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={currentTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="All Families" />
          <Tab label="Members" />
          <Tab label="Prospective" />
          <Tab label="Reports" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {currentTab === 0 && (
            <>
              {/* Search and Filters */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search families by name, Hebrew name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: 600 }}
                />
              </Box>

              {/* Loading State */}
              {isLoading && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px" width="100%">
                  <CircularProgress size={40} />
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    Loading families...
                  </Typography>
                </Box>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                  <Button onClick={loadFamilies} size="small" sx={{ ml: 2 }}>
                    Retry
                  </Button>
                </Alert>
              )}

              {/* Empty State */}
              {!isLoading && !error && families.length === 0 && (
                <Box display="flex" flexDirection="column" alignItems="center" minHeight="200px" justifyContent="center">
                  <People sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No families found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Get started by adding your first family
                  </Typography>
                  <Button variant="contained" onClick={handleAddFamily} startIcon={<Add />}>
                    Add Family
                  </Button>
                </Box>
              )}

              {/* Family Cards */}
              {!isLoading && !error && families.length > 0 && (
                <Grid container spacing={3}>
                  {filteredFamilies.map((family) => (
                  <Grid item xs={12} md={6} lg={4} key={family.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {family.familyName}
                            </Typography>
                            {family.hebrewFamilyName && (
                              <Typography variant="body2" sx={{ color: '#6A1B9A', fontWeight: 500 }}>
                                {family.hebrewFamilyName}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {family.isFoundingFamily && (
                              <Chip
                                icon={<Star />}
                                label="Founding"
                                size="small"
                                sx={{ bgcolor: '#FFD700', color: '#E65100', fontSize: '0.7rem' }}
                              />
                            )}
                            {family.isBoardFamily && (
                              <Chip
                                icon={<Group />}
                                label="Board"
                                size="small"
                                sx={{ bgcolor: '#E1BEE7', color: '#4A148C', fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        </Box>

                        <Chip
                          label={family.membershipStatus.charAt(0).toUpperCase() + family.membershipStatus.slice(1)}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(family.membershipStatus),
                            color: '#FFFFFF',
                            mb: 2
                          }}
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <People sx={{ fontSize: 16, color: '#6A1B9A', mr: 1 }} />
                          <Typography variant="body2">
                            {family.memberCount} member{family.memberCount !== 1 ? 's' : ''}
                          </Typography>
                        </Box>

                        {family.primaryEmail && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Email sx={{ fontSize: 16, color: '#6A1B9A', mr: 1 }} />
                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                              {family.primaryEmail}
                            </Typography>
                          </Box>
                        )}

                        {family.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Phone sx={{ fontSize: 16, color: '#6A1B9A', mr: 1 }} />
                            <Typography variant="body2">
                              {family.phone}
                            </Typography>
                          </Box>
                        )}

                        {family.address && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Home sx={{ fontSize: 16, color: '#6A1B9A', mr: 1 }} />
                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                              {family.address}, {family.city}
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                          <MonetizationOn sx={{ fontSize: 16, color: '#43A047', mr: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Annual Pledge: {formatCurrency(family.annualPledge, family.currency)}
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          sx={{ color: '#6A1B9A' }}
                        >
                          View
                        </Button>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleEditFamily(family)}
                            sx={{ color: '#FFA726' }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: '#E53935' }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
                </Grid>
              )}

              {!isLoading && !error && filteredFamilies.length === 0 && families.length > 0 && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  No families found matching your search criteria.
                </Alert>
              )}
            </>
          )}

          {currentTab === 1 && (
            <Typography variant="h6" sx={{ color: '#424242' }}>
              Member families view - Coming soon
            </Typography>
          )}

          {currentTab === 2 && (
            <Typography variant="h6" sx={{ color: '#424242' }}>
              Prospective families view - Coming soon
            </Typography>
          )}

          {currentTab === 3 && (
            <Typography variant="h6" sx={{ color: '#424242' }}>
              Family reports and analytics - Coming soon
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Family Form Dialog */}
      <FamilyFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        family={editingFamily}
        onSave={handleSaveFamily}
      />
    </Box>
  )
}



export default FamiliesPage 