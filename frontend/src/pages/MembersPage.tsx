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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material'
import {
  Add,
  Search,
  Person,
  Email,
  Phone,
  Cake,
  Edit,
  Delete,
  Visibility,
  People,
  Star,
  Work,
  Female,
  Male,
  Group,
  Church,
  Favorite
} from '@mui/icons-material'
import { apiService } from '../services/apiService'
import { FamilyMember } from '../types'

const MembersPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterGender, setFilterGender] = useState<string>('all')
  const [filterRelationship, setFilterRelationship] = useState<string>('all')
  const [filterActiveStatus, setFilterActiveStatus] = useState<string>('true')
  const [birthdaysThisMonth, setBirthdaysThisMonth] = useState<FamilyMember[]>([])
  const [yahrzeitsThisMonth, setYahrzeitsThisMonth] = useState<FamilyMember[]>([])
  const [upcomingBnaiMitzvah, setUpcomingBnaiMitzvah] = useState<FamilyMember[]>([])

  // Load members from API
  const loadMembers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const params = {
        search: searchTerm || undefined,
        gender: filterGender !== 'all' ? filterGender : undefined,
        relationshipToHead: filterRelationship !== 'all' ? filterRelationship : undefined,
        isActive: filterActiveStatus
      }
      
      const response = await apiService.familyMembers.getAll(params)
      setMembers(response.members || [])
      
      // Debug logging
      console.log('Loaded members from API:', response.members?.length || 0)
    } catch (error: any) {
      console.error('Error loading members:', error)
      setError('Failed to load members. Please try again.')
      setMembers([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load special events
  const loadSpecialEvents = async () => {
    try {
      const [birthdays, yahrzeits, bnaiMitzvah] = await Promise.all([
        apiService.familyMembers.getBirthdaysThisMonth(),
        apiService.familyMembers.getYahrzeitsThisMonth(),
        apiService.familyMembers.getUpcomingBnaiMitzvah()
      ])
      
      setBirthdaysThisMonth(birthdays.birthdays || [])
      setYahrzeitsThisMonth(yahrzeits.yahrzeits || [])
      setUpcomingBnaiMitzvah(bnaiMitzvah.upcomingBnaiMitzvah || [])
    } catch (error) {
      console.error('Error loading special events:', error)
    }
  }

  // Load data on component mount and when filters change
  useEffect(() => {
    loadMembers()
  }, [searchTerm, filterGender, filterRelationship, filterActiveStatus])

  useEffect(() => {
    loadSpecialEvents()
  }, [])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  const getAge = (dateOfBirth?: string): number | null => {
    if (!dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const getGenderIcon = (gender?: string) => {
    switch (gender) {
      case 'male': return <Male sx={{ color: '#2196F3' }} />
      case 'female': return <Female sx={{ color: '#E91E63' }} />
      default: return <Person sx={{ color: '#9E9E9E' }} />
    }
  }

  const getPriestlyStatus = (member: FamilyMember) => {
    if (member.isCohen) return { text: 'Cohen', color: '#FFD700' }
    if (member.isLevi) return { text: 'Levi', color: '#C0C0C0' }
    return null
  }

  const formatRelationship = (relationship: string) => {
    return relationship.charAt(0).toUpperCase() + relationship.slice(1)
  }

  const filteredMembers = members.filter(member => 
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.hebrewFirstName?.includes(searchTerm) ||
    member.hebrewLastName?.includes(searchTerm) ||
            member.family?.familyName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#4A148C', fontWeight: 600 }}>
          Member Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {/* TODO: Open member form */}}
          sx={{ bgcolor: '#6A1B9A', '&:hover': { bgcolor: '#9C4DCC' } }}
        >
          Add Member
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#E8F5E8', borderLeft: '4px solid #4CAF50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                    {members.filter(m => m.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Members
                  </Typography>
                </Box>
                <Group sx={{ fontSize: 40, color: '#4CAF50' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#FFF3E0', borderLeft: '4px solid #FF9800' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#FF9800' }}>
                    {birthdaysThisMonth.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Birthdays This Month
                  </Typography>
                </Box>
                <Cake sx={{ fontSize: 40, color: '#FF9800' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#F3E5F5', borderLeft: '4px solid #9C27B0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#9C27B0' }}>
                    {yahrzeitsThisMonth.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Yahrzeits This Month
                  </Typography>
                </Box>
                                 <Favorite sx={{ fontSize: 40, color: '#9C27B0' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#E3F2FD', borderLeft: '4px solid #2196F3' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#2196F3' }}>
                    {upcomingBnaiMitzvah.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming B'nai Mitzvah
                  </Typography>
                </Box>
                <Star sx={{ fontSize: 40, color: '#2196F3' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ bgcolor: '#FFFFFF', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          sx={{ borderBottom: '1px solid #E0E0E0', bgcolor: '#F8F9FA' }}
        >
          <Tab label="All Members" />
          <Tab label={`Birthdays (${birthdaysThisMonth.length})`} />
          <Tab label={`Yahrzeits (${yahrzeitsThisMonth.length})`} />
          <Tab label={`B'nai Mitzvah (${upcomingBnaiMitzvah.length})`} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {currentTab === 0 && (
            <>
              {/* Search and Filters */}
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      placeholder="Search members by name, email, or family..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={filterGender}
                        label="Gender"
                        onChange={(e) => setFilterGender(e.target.value)}
                      >
                        <MenuItem value="all">All Genders</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Relationship</InputLabel>
                      <Select
                        value={filterRelationship}
                        label="Relationship"
                        onChange={(e) => setFilterRelationship(e.target.value)}
                      >
                        <MenuItem value="all">All Relationships</MenuItem>
                        <MenuItem value="self">Head of Family</MenuItem>
                        <MenuItem value="spouse">Spouse</MenuItem>
                        <MenuItem value="child">Child</MenuItem>
                        <MenuItem value="parent">Parent</MenuItem>
                        <MenuItem value="sibling">Sibling</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={filterActiveStatus}
                        label="Status"
                        onChange={(e) => setFilterActiveStatus(e.target.value)}
                      >
                        <MenuItem value="true">Active Only</MenuItem>
                        <MenuItem value="false">Inactive Only</MenuItem>
                        <MenuItem value="all">All Members</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* Loading State */}
              {isLoading && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress size={40} />
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    Loading members...
                  </Typography>
                </Box>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                  <Button onClick={loadMembers} size="small" sx={{ ml: 2 }}>
                    Retry
                  </Button>
                </Alert>
              )}

              {/* Empty State */}
              {!isLoading && !error && members.length === 0 && (
                <Box display="flex" flexDirection="column" alignItems="center" minHeight="200px" justifyContent="center">
                  <Person sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No members found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add family members to get started
                  </Typography>
                  <Button variant="contained" startIcon={<Add />}>
                    Add Member
                  </Button>
                </Box>
              )}

              {/* Members Grid */}
              {!isLoading && !error && members.length > 0 && (
                <Grid container spacing={3}>
                  {filteredMembers.map((member) => (
                    <Grid item xs={12} md={6} lg={4} key={member.id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <IconButton sx={{ bgcolor: '#6A1B9A', mr: 2 }}>
                              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                            </IconButton>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {member.firstName} {member.lastName}
                                {member.nickname && ` (${member.nickname})`}
                              </Typography>
                              {(member.hebrewFirstName || member.hebrewLastName) && (
                                <Typography variant="body2" sx={{ color: '#6A1B9A', fontWeight: 500 }}>
                                  {member.hebrewFirstName} {member.hebrewLastName}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getGenderIcon(member.gender)}
                              {!member.isActive && (
                                <Chip label="Inactive" size="small" color="error" />
                              )}
                            </Box>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <People sx={{ fontSize: 16, mr: 1 }} />
                              {member.family?.familyName || 'Unknown Family'} - {formatRelationship(member.relationshipToHead)}
                            </Typography>
                            
                            {member.email && (
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Email sx={{ fontSize: 16, mr: 1 }} />
                                {member.email}
                              </Typography>
                            )}
                            
                            {member.phone && (
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Phone sx={{ fontSize: 16, mr: 1 }} />
                                {member.phone}
                              </Typography>
                            )}
                            
                            {member.dateOfBirth && (
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Cake sx={{ fontSize: 16, mr: 1 }} />
                                Age {getAge(member.dateOfBirth)}
                              </Typography>
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {member.isPrimaryContact && (
                              <Chip label="Primary Contact" size="small" color="primary" />
                            )}
                            {getPriestlyStatus(member) && (
                              <Chip 
                                label={getPriestlyStatus(member)!.text} 
                                size="small" 
                                sx={{ bgcolor: getPriestlyStatus(member)!.color, color: 'black' }}
                              />
                            )}
                            {member.israeliCitizenship && (
                              <Chip label="Israeli Citizen" size="small" color="info" />
                            )}
                            {member.profession && (
                              <Tooltip title={member.profession}>
                                <Chip label="Professional" size="small" icon={<Work />} />
                              </Tooltip>
                            )}
                                                         {member.synagogueRoles && (
                               <Tooltip title={member.synagogueRoles}>
                                 <Chip label="Synagogue Role" size="small" icon={<Church />} />
                               </Tooltip>
                             )}
                          </Box>
                        </CardContent>

                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Button size="small" startIcon={<Visibility />}>
                            View
                          </Button>
                          <Button size="small" startIcon={<Edit />}>
                            Edit
                          </Button>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {!isLoading && !error && filteredMembers.length === 0 && members.length > 0 && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  No members found matching your search criteria.
                </Alert>
              )}
            </>
          )}

          {/* Other tabs content */}
          {currentTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                🎂 Birthdays This Month
              </Typography>
              {birthdaysThisMonth.length === 0 ? (
                <Typography color="text.secondary">No birthdays this month.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {birthdaysThisMonth.map((member) => (
                    <Grid item xs={12} md={6} key={member.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">
                            {member.firstName} {member.lastName}
                          </Typography>
                          <Typography color="text.secondary">
                            {member.family?.familyName || 'Unknown Family'} • Age {getAge(member.dateOfBirth)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {currentTab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                🕯️ Yahrzeits This Month
              </Typography>
              {yahrzeitsThisMonth.length === 0 ? (
                <Typography color="text.secondary">No yahrzeits this month.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {yahrzeitsThisMonth.map((member) => (
                    <Grid item xs={12} md={6} key={member.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">
                            {member.firstName} {member.lastName}
                          </Typography>
                          <Typography color="text.secondary">
                            {member.family?.familyName || 'Unknown Family'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {currentTab === 3 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                ⭐ Upcoming B'nai Mitzvah
              </Typography>
              {upcomingBnaiMitzvah.length === 0 ? (
                <Typography color="text.secondary">No upcoming B'nai Mitzvah.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {upcomingBnaiMitzvah.map((member) => (
                    <Grid item xs={12} md={6} key={member.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">
                            {member.firstName} {member.lastName}
                          </Typography>
                          <Typography color="text.secondary">
                            {member.family?.familyName || 'Unknown Family'} • Age {getAge(member.dateOfBirth)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default MembersPage 