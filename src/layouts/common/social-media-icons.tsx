import { Stack, Typography } from '@mui/material'
import React from 'react'
import Iconify from 'src/components/iconify/iconify'

function SocialMediaIcons() {
    return (
        <>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} mb={1} ml={0.5}>
                Follow Us :
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Stack
                    component="a"
                    href="https://www.facebook.com/bharattexbttf"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: '#1877F2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { opacity: 0.8 },
                    }}
                >
                    <Iconify icon="mdi:facebook" color="white" width={16} height={16} />
                </Stack>

                <Stack
                    component="a"
                    href="https://www.instagram.com/bharat_tex/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: '#E4405F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { opacity: 0.8 },
                    }}
                >
                    <Iconify icon="mdi:instagram" color="white" width={16} height={16} />
                </Stack>

                <Stack
                    component="a"
                    href="https://x.com/Bharat_tex"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: '#000000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { opacity: 0.8 },
                    }}
                >
                    <Iconify icon="mdi:twitter" color="white" width={16} height={16} />
                </Stack>

                <Stack
                    component="a"
                    href="https://www.linkedin.com/showcase/bharattex/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: '#0A66C2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { opacity: 0.8 },
                    }}
                >
                    <Iconify icon="mdi:linkedin" color="white" width={16} height={16} />
                </Stack>

                <Stack
                    component="a"
                    href="https://www.youtube.com/@BharatTex"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: '#FF0000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { opacity: 0.8 },
                    }}
                >
                    <Iconify icon="mdi:youtube" color="white" width={16} height={16} />
                </Stack>
            </Stack>
        </>

    )
}

export default SocialMediaIcons