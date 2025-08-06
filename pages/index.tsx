import React, { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material'
import { usePrivy } from '@privy-io/react-auth'
import { useIexec } from '@/context/iExec'

export default function Home() {
  const { login, logout, authenticated, user, ready } = usePrivy()
  const { dataProtector, isInitializing, protectAndStoreData, fetchAccessGranted } = useIexec()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleProtectData = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter an email address' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const result = await protectAndStoreData(email)
      setMessage({
        type: 'success',
        text: `Data protected successfully! Protected data address: ${result.protectedData.address}`,
      })
      setEmail('')
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error protecting data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFetchAccess = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await fetchAccessGranted()
      setMessage({
        type: 'success',
        text: `Found ${result.protectedData.length} protected data items and ${result.accessGranted.length} access grants`,
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error fetching access: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!ready) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          iExec Privy Example
        </Typography>

        <Paper sx={{ p: 3, width: '100%', mt: 3 }}>
          {!authenticated ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Connect your wallet to get started
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={login}
                sx={{ mt: 2 }}
              >
                Connect Wallet
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Welcome, {user?.wallet?.address?.slice(0, 6)}...
                {user?.wallet?.address?.slice(-4)}
              </Typography>

              <Button
                variant="outlined"
                onClick={logout}
                sx={{ mb: 3 }}
              >
                Disconnect
              </Button>

              {isInitializing ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Initializing iExec SDK...
                  </Typography>
                </Box>
              ) : dataProtector ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    iExec Data Protection
                  </Typography>

                  <TextField
                    fullWidth
                    label="Email to protect"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                    placeholder="Enter your email address"
                  />

                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button
                      variant="contained"
                      onClick={handleProtectData}
                      disabled={isLoading || !email}
                    >
                      {isLoading ? <CircularProgress size={20} /> : 'Protect Data'}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={handleFetchAccess}
                      disabled={isLoading}
                    >
                      {isLoading ? <CircularProgress size={20} /> : 'Fetch Access'}
                    </Button>
                  </Box>

                  {message && (
                    <Alert severity={message.type} sx={{ mt: 2 }}>
                      {message.text}
                    </Alert>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Please switch to iExec Sidechain network to use data protection features.
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  )
}
