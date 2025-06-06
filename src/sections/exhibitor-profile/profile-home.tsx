'use client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';

import Iconify from 'src/components/iconify';
import { Lightbox } from 'src/components/lightbox';
import useLightBox from 'src/components/lightbox/use-light-box';

import { IUserProfile, IUserProfilePost } from 'src/types/user';
import { IExhibitorItem } from 'src/types/team';
import { Container } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useEventContext } from 'src/components/event-context';

// ----------------------------------------------------------------------

type Props = {
  info: IExhibitorItem;
  posts: IUserProfilePost[];
};

const VIDEOS = [
  {
    id: 1,
    title: 'Product Showcase',
    thumbnail:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
    videoUrl:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  },
  {
    id: 2,
    title: 'Product Demo',
    thumbnail:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: 3,
    title: 'Feature Overview',
    thumbnail:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    videoUrl:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 4,
    title: 'Feature Overview',
    thumbnail:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
];

// Add sample ads data
const ADS = [
  {
    id: 1,
    title: 'Product Advertisement',
    thumbnail:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: 2,
    title: 'Brand Campaign',
    thumbnail:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: 3,
    title: 'Special Offer',
    thumbnail:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
];

const YOUTUBE_VIDEOS = [
  {
    id: 1,
    link: 'https://youtu.be/-ymC3gjF9M4?si=sEGfT8fc-TZjr6P-',
  },
  {
    id: 2,
    link: 'https://youtu.be/QEU6xv3_6bY?si=QZ1O-1JKrgRaiigo',
  },
  {
    id: 3,
    link: 'https://youtu.be/zHk7GS5P0dY?si=N6MwVQ8d8Bt2Jty2',
  },
];

export default function ProfileHome({ info, posts }: Props) {
  const router = useRouter();
  const { eventData } = useEventContext();

  const videoSlides = VIDEOS.map((video) => ({
    type: 'video' as const,
    url: video.videoUrl,
  }));

  const adSlides = ADS.map((ad) => ({
    type: 'video' as const,
    url: ad.videoUrl,
  }));

  const settings = useSettingsContext();

  const {
    currentIndex: videoIndex,
    open: videoOpen,
    onOpen: onVideoOpen,
    onClose: onVideoClose,
    onNext: onVideoNext,
    onPrev: onVideoPrev,
  } = useLightBox(videoSlides);

  const {
    currentIndex: adIndex,
    open: adOpen,
    onOpen: onAdOpen,
    onClose: onAdClose,
    onNext: onAdNext,
    onPrev: onAdPrev,
  } = useLightBox(adSlides);

  const handlePlayVideo = (videoId: number) => {
    const index = VIDEOS.findIndex((v) => v.id === videoId);
    if (index !== -1) {
      onVideoOpen(index);
    }
  };

  const handlePlayAd = (adId: number) => {
    const index = ADS.findIndex((ad) => ad.id === adId);
    if (index !== -1) {
      onAdOpen(index);
    }
  };

  const extractVideoId = (url: string) => {
    const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/];

    const foundMatch = patterns
      .map((pattern) => url.match(pattern))
      .find((matchResult) => matchResult && matchResult[1]);

    return foundMatch ? foundMatch[1] : null;
  };

  const renderFollows = (
    <Card sx={{ p: 3, boxShadow: 'none', bgcolor: 'transparent', border: 'none' }}>
      <Stack spacing={5} sx={{ width: '100%' }}>
        <Stack direction="row" alignItems="flex-start">
          <Stack spacing={0.5}>
            <Box sx={{ typography: 'h4' }}>{info.companyName}</Box>
            <Box sx={{ typography: 'body2', color: 'text.secondary' }}>Exhibitor ID {info.id}</Box>
          </Stack>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              ml: 10,
              mr: 4,
              borderColor: 'common.black',
              borderRightWidth: 2,
            }}
          />

          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1}>
              <Box sx={{ typography: 'body2', color: 'text.secondary' }}>GSTIN:</Box>
              <Box sx={{ typography: 'body2' }}>{info.gstNo || 'N/A'}</Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Box sx={{ typography: 'body2', color: 'text.secondary' }}>PAN:</Box>
              <Box sx={{ typography: 'body2' }}>{info.panNo || 'N/A'}</Box>
            </Stack>
          </Stack>
        </Stack>

        <Grid container spacing={3} sx={{ width: '100%' }}>
          <Grid xs={12} md={8}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Box sx={{ typography: 'h5' }}>Description</Box>
                <IconButton
                  onClick={() =>
                    router.push(
                      paths.dashboard.exhibitorProfile.edit(String(eventData?.state.exhibitorId))
                    )
                  }
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'background.paper',
                    },
                    '&:hover svg': {
                      transform: 'scale(1.4)',
                    },
                    '& svg': {
                      transition: 'transform 0.2s',
                    },
                  }}
                >
                  <Iconify icon="eva:edit-2-fill" width={24} />
                </IconButton>
              </Stack>
              <Box
                sx={{
                  typography: 'body2',
                  color: 'text.secondary',
                  maxHeight: 300,
                  overflow: 'auto',
                }}
              >
                {info.about ||
                  'Your company profile is currently missing a description. To enhance visibility and credibility, please go to Edit Profile and update the "About Your Company" section. A clear description helps visitors understand your business, services, and values—making a strong first impression and building trust with potential clients and partners.'}
              </Box>
            </Box>
          </Grid>

          <Grid xs={12} md={4}>
            <Box
              sx={{
                bgcolor: '#B0E4D2',
                borderRadius: 2,
                p: 3,
                height: 160,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ typography: 'h6', mb: 1 }}>Contact Details</Box>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1}>
                  <Box sx={{ display: 'flex', flexShrink: 0 }}>
                    <Iconify icon="material-symbols:mail-outline-rounded" width={20} />
                  </Box>
                  <Box sx={{ typography: 'body2', wordBreak: 'break-word' }}>
                    {info.supportEmail || 'N/A'}
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Box sx={{ display: 'flex', flexShrink: 0 }}>
                    <Iconify icon="solar:phone-linear" width={20} />
                  </Box>
                  <Box sx={{ typography: 'body2', wordBreak: 'break-word' }}>
                    {info.supportPhone || 'N/A'}
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );

  const renderYourVideos = (
    <Card sx={{ boxShadow: 'none', bgcolor: 'transparent', border: 'none', px: 3, mt: 4 }}>
      <Box sx={{ typography: 'h5', mb: 2 }}>Your Videos</Box>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'divider',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'grey.500',
            borderRadius: 4,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            py: 1,
            px: 0.5,
            minWidth: 'min-content',
          }}
        >
          {VIDEOS.map((video) => (
            <Card
              key={video.id}
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 'none',
                width: 500,
                flexShrink: 0,
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={video.thumbnail}
                  alt={video.title}
                  sx={{
                    width: '100%',
                    height: 300,
                    objectFit: 'cover',
                  }}
                />
                {/* Dark gradient overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.1) 100%)',
                  }}
                />
                <IconButton
                  onClick={() => handlePlayVideo(video.id)}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 80,
                    height: 80,
                    bgcolor: 'rgba(128, 128, 128, 0.9)',
                    '&:hover': {
                      bgcolor: 'rgba(128, 128, 128, 1)',
                    },
                    '& svg': {
                      transition: 'transform 0.2s',
                      color: 'black',
                    },
                    '&:hover svg': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Iconify icon="solar:play-bold" width={32} />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>

      <Lightbox
        open={videoOpen}
        onClose={onVideoClose}
        slides={videoSlides}
        currentIndex={videoIndex}
        onNext={onVideoNext}
        onPrev={onVideoPrev}
      />
    </Card>
  );

  const renderYourAds = (
    <Card sx={{ boxShadow: 'none', bgcolor: 'transparent', border: 'none', px: 3, mt: 2 }}>
      <Box sx={{ typography: 'h5', mb: 2 }}>Your Ads</Box>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'divider',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'grey.500',
            borderRadius: 4,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            py: 1,
            px: 0.5,
            minWidth: 'min-content',
          }}
        >
          {ADS.map((ad) => (
            <Card
              key={ad.id}
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 'none',
                width: 500,
                flexShrink: 0,
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={ad.thumbnail}
                  alt={ad.title}
                  sx={{
                    width: '100%',
                    height: 300,
                    objectFit: 'cover',
                  }}
                />
                {/* Dark gradient overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.1) 100%)',
                  }}
                />
                <IconButton
                  onClick={() => handlePlayAd(ad.id)}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 80,
                    height: 80,
                    bgcolor: 'rgba(128, 128, 128, 0.9)',
                    '&:hover': {
                      bgcolor: 'rgba(128, 128, 128, 1)',
                    },
                    '& svg': {
                      transition: 'transform 0.2s',
                      color: 'black',
                    },
                    '&:hover svg': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Iconify icon="solar:play-bold" width={32} />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>

      <Lightbox
        open={adOpen}
        onClose={onAdClose}
        slides={adSlides}
        currentIndex={adIndex}
        onNext={onAdNext}
        onPrev={onAdPrev}
      />
    </Card>
  );

  const renderYourYouTubeVideos = (
    <Card sx={{ boxShadow: 'none', bgcolor: 'transparent', border: 'none', px: 3, mt: 2 }}>
      <Box sx={{ typography: 'h5', mb: 2 }}>Your Videos</Box>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'divider',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'grey.500',
            borderRadius: 4,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            py: 1,
            px: 0.5,
            minWidth: 'min-content',
          }}
        >
          {info?.videos?.map((video) => (
            <Card
              key={video}
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 'none',
                width: 500,
                flexShrink: 0,
              }}
            >
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <Box
                  component="iframe"
                  src={`https://www.youtube.com/embed/${extractVideoId(video)}`}
                  // title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                />
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>
    </Card>
  );

  const renderFooter = (
    <Grid xs={12} sx={{ mb: 0, mt: 4, pb: 0 }}>
      <Box
        sx={{
          mt: 4,
          mb: 0,
          pb: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'transparent',
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Stack direction="row" spacing={2}>
            {info.facebookUrl && (
              <IconButton
                component={Link}
                href={info.facebookUrl}
                sx={{
                  color: '#000',
                  bgcolor: '#F5F5F5',
                  '&:hover': {
                    bgcolor: '#E0E0E0',
                  },
                }}
              >
                <Iconify icon="ri:facebook-fill" width={24} />
              </IconButton>
            )}

            {info.linkedinUrl && (
              <IconButton
                component={Link}
                href={info.linkedinUrl}
                sx={{
                  color: '#000',
                  bgcolor: '#F5F5F5',
                  '&:hover': {
                    bgcolor: '#E0E0E0',
                  },
                }}
              >
                <Iconify icon="ri:linkedin-fill" width={24} />
              </IconButton>
            )}

            {info.youtubeUrl && (
              <IconButton
                component={Link}
                href={info.youtubeUrl}
                sx={{
                  color: '#000',
                  bgcolor: '#F5F5F5',
                  '&:hover': {
                    bgcolor: '#E0E0E0',
                  },
                }}
              >
                <Iconify icon="mdi:youtube" width={24} />
              </IconButton>
            )}
          </Stack>

          {(info.facebookUrl || info.linkedinUrl || info.youtubeUrl) && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Reach out on our socials
            </Typography>
          )}
        </Stack>
      </Box>
    </Grid>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={4}>
        {renderFollows}
        {/* {renderYourAds} */}
        {renderYourYouTubeVideos}
        {/* {renderYourVideos} */}
        {renderFooter}
      </Grid>
    </Container>
  );
}
