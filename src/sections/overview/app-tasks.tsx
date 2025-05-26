'use client';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CircularProgress from '@mui/material/CircularProgress';

import { ITask } from 'src/types/overview';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useEventContext } from 'src/components/event-context';
import { useGetTasks, useUpdateTask } from 'src/api/overview';

const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Session Asset Submission',
    description: 'Assumenda nam repudiandae rerum fugiat vel...',
    dueDate: '24/01/2025',
    completed: false,
  },
  {
    id: 2,
    title: 'Session Asset Submission',
    description: 'Reprehenderit ut voluptas sapiente ratione nost...',
    dueDate: '26/01/2025',
    completed: false,
  },
  {
    id: 3,
    title: 'Session Asset Submission',
    description: 'Quo quia sit nihil doloremque et.',
    dueDate: '28/01/2025',
    completed: true,
  },
  {
    id: 4,
    title: 'Additional Task 1',
    description: 'Another pending task...',
    dueDate: '23/01/2025',
    completed: false,
  },
  {
    id: 5,
    title: 'Additional Task 2',
    description: 'One more task to do...',
    dueDate: '25/01/2025',
    completed: false,
  },
];

const getTaskDescription = (taskName: string): string => {
  switch (taskName) {
    case 'Exhibitor Document':
      return 'Click here to upload Exhibitor Document';
    case 'User Document':
      return 'Click here to upload User Document';
    case 'Click Chat':
      return 'Click here to go to chat';
    case 'Click Connects':
      return 'Click here to find connects';
    case 'Click Product':
      return 'Click here to view your production requirements';
    default:
      return '';
  }
};

const getTaskTitle = (taskName: string): string => {
  switch (taskName) {
    case 'Exhibitor Document':
      return 'Upload Exhibitor Documents';
    case 'User Document':
      return 'Upload User Documents';
    case 'Click Chat':
      return 'Chat';
    case 'Click Connects':
      return 'Connects';
    case 'Click Product':
      return 'Order Production Requirements';
    default:
      return '';
  }
};

export default function AppTasks() {
  const theme = useTheme();

  const router = useRouter();

  const { eventData } = useEventContext();

  const { tasks, reFetchTasks } = useGetTasks(eventData?.state?.eventId);

  const [allTasks, setAllTasks] = useState(tasks);
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);

  useEffect(() => {
    setAllTasks(tasks);
  }, [tasks]);

  const { updateTask } = useUpdateTask();

  const handleTaskAction = async (task: ITask) => {
    try {
      setLoadingTaskId(task.id);
      switch (task.taskName) {
        case 'Exhibitor Document':
          router.push(paths.dashboard.documents.upload);
          await updateTask(task.id, true);
          break;
        case 'User Document':
          router.push(paths.dashboard.documents.upload);
          await updateTask(task.id, true);
          break;
        case 'Click Chat':
          router.push(paths.dashboard.chat);
          await updateTask(task.id, true);
          break;
        case 'Click Connects':
          router.push(paths.dashboard.myConnects);
          await updateTask(task.id, true);
          break;
        case 'Click Product':
          router.push(paths.dashboard.productionRequirements.root);
          await updateTask(task.id, true);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Failed to handle task action:', error);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const completedTasks = allTasks.filter((task) => task.status).length;
  const progress = (completedTasks / allTasks.length) * 100 || 0;

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  const tasksToDisplay = [...allTasks].sort((a, b) => {
    if (!a.status && b.status) return -1;
    if (a.status && !b.status) return 1;

    return 0;
  });

  // const handleCompleteTask = (taskId: number) => {
  //   setTasks((prevTasks) =>
  //     prevTasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task))
  //   );
  // };

  return (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Tasks</Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            {progress.toFixed(0)}%
          </Typography>
        </Stack>

        <LinearProgress
          value={progress}
          variant="determinate"
          color="success"
          sx={{ height: 8, bgcolor: alpha(theme.palette.success.main, 0.12) }}
        />

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {completedTasks} of {allTasks.length} tasks are completed.
        </Typography>

        <Divider />

        <Stack
          spacing={2}
          // sx={{
          //   pb: 2,
          //   borderBottom: '1.4px dashed',
          //   borderColor: 'divider',
          // }}
        >
          {tasksToDisplay.length === 0 ? (
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}
            >
              No tasks for you
            </Typography>
          ) : (
            tasksToDisplay.map((task) => (
              <Stack key={task.id} spacing={2}>
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  sx={{
                    borderLeft: `3px solid ${
                      task.status ? theme.palette.success.main : theme.palette.error.main
                    }`,
                    pl: 2,
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {getTaskTitle(task.taskName)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {getTaskDescription(task.taskName)}
                    </Typography>
                    {/* <Typography
                    variant="caption"
                    sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}
                  >
                    Due: {task.dueDate}
                  </Typography> */}
                  </Box>

                  {task.status ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.08),
                        py: 0.75,
                        px: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                        Completed
                      </Typography>
                      <CheckCircleIcon sx={{ width: 16, height: 16, color: 'success.main' }} />
                    </Stack>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleTaskAction(task)}
                      disabled={loadingTaskId === task.id}
                      startIcon={loadingTaskId === task.id ? <CircularProgress size={16} /> : null}
                      sx={{
                        minWidth: 'auto',
                        whiteSpace: 'nowrap',
                        px: { xs: 1, sm: 2 },
                        '& .MuiButton-startIcon': {
                          margin: { xs: '0', sm: '0 8px 0 -4px' },
                        },
                      }}
                    >
                      {loadingTaskId === task.id ? (
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                          Processing...
                        </Box>
                      ) : (
                        <Box component="span" sx={{ display: 'inline' }}>
                          Complete Now
                        </Box>
                      )}
                    </Button>
                  )}
                </Stack>
              </Stack>
            ))
          )}
        </Stack>

        {/* <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <Button endIcon={<ChevronRightIcon />} sx={{ typography: 'subtitle2' }}>
            View all ({tasks.length})
          </Button>
        </Stack> */}
      </Stack>
    </Card>
  );
}
