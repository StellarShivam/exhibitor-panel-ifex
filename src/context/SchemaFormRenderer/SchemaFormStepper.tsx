import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { useSchemaFormRenderer } from './SchemaFormRendererContext';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SchemaFormStepperProps {
    /** Title shown above the timeline. Defaults to "Register Now". */
    title?: string;
    /** Tailwind/inline class on the sidebar wrapper. Defaults to the pink exhibitor sidebar. */
    className?: string;
    /** Show a non-clickable Payment step at the end. */
    showPaymentStep?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * MUI Timeline sidebar listing all form steps.
 * Reads step state from the nearest <SchemaFormRendererProvider>.
 *
 * Drop this inside the provider alongside <SchemaFormRenderer>:
 *
 * @example
 * <SchemaFormRendererProvider config={config}>
 *   <div className="flex">
 *     <SchemaFormStepper title="Apply Now" />
 *     <div className="flex-1">
 *       <SchemaFormRenderer />
 *     </div>
 *   </div>
 * </SchemaFormRendererProvider>
 */
export function SchemaFormStepper({
    title = 'Register Now',
    className,
    showPaymentStep = false,
}: SchemaFormStepperProps) {
    const { steps, currentStep, currentStepIndex, goToStep, stepped } =
        useSchemaFormRenderer();

    if (!stepped || !steps.length) return null;

    return (
        <div
            className={
                className ??
                'flex flex-col justify-start gap-3 lg:gap-8 items-center lg:items-start lg:w-2/5 w-full bg-[#ffa206] rounded-t-2xl lg:rounded-2xl lg:pl-5 px-4 py-6 lg:py-12 text-white'
            }
        >
            <h1 className="text-white text-2xl lg:text-3xl font-semibold px-4">
                {title}
            </h1>

            <Timeline
                sx={{
                    [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 },
                    alignItems: { xs: 'center', md: 'flex-start' },
                    paddingLeft: { lg: 0 },
                    marginLeft: { lg: '10px' },
                    flexDirection: { xs: 'row', md: 'column' },
                    overflowX: { xs: 'auto', md: 'visible' },
                    alignSelf: { xs: 'center', md: 'flex-start' },
                }}
            >
                {steps.map((step, index) => {
                    const isCurrent = currentStep?.id === step.id;
                    const isPastOrCurrent = index <= currentStepIndex;
                    const isClickable = step.completed || isPastOrCurrent;

                    return (
                        <TimelineItem
                            key={step.id}
                            sx={{
                                minHeight: { xs: 'auto', md: '80px' },
                                display: 'flex',
                                flexDirection: 'row',
                                '& .MuiTimelineContent-root': {
                                    marginLeft: '10px',
                                    paddingTop: '10px',
                                    paddingLeft: '8px',
                                    paddingRight: '8px',
                                },
                                '& .MuiTimelineSeparator-root': {
                                    flexDirection: { xs: 'row', md: 'column' },
                                },
                            }}
                        >
                            <TimelineSeparator>
                                <TimelineDot
                                    sx={{
                                        width: { xs: '36px', md: '40px' },
                                        height: { xs: '36px', md: '40px' },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: step.completed || isCurrent ? '#ffa206' : 'white',
                                        backgroundColor:
                                            step.completed || isCurrent ? 'white' : 'transparent',
                                        borderColor: 'white',
                                        borderWidth: '2px',
                                        borderStyle: 'solid',
                                        borderRadius: '50%',
                                        cursor: isClickable ? 'pointer' : 'not-allowed',
                                        opacity: isClickable ? 1 : 0.5,
                                        margin: { xs: 'none', lg: 0 },
                                        transition: 'background-color 0.2s, color 0.2s',
                                    }}
                                    variant={step.completed || isCurrent ? 'filled' : 'outlined'}
                                    onClick={() => isClickable && goToStep(step.id)}
                                >
                                    {step.completed && !isCurrent ? (
                                        <CheckIcon sx={{ color: '#ffa206', fontSize: '20px' }} />
                                    ) : (
                                        step.id
                                    )}
                                </TimelineDot>

                                {(index < steps.length - 1 || showPaymentStep) && (
                                    <TimelineConnector
                                        sx={{
                                            flex: 1,
                                            backgroundColor: 'transparent',
                                            borderLeft: { xs: 'none', md: '2px dashed rgba(255,255,255,0.5)' },
                                            borderTop: { xs: '2px dashed rgba(255,255,255,0.5)', md: 'none' },
                                            width: { xs: 'auto', md: '0px' },
                                            height: { xs: '0px', md: 'auto' },
                                            alignSelf: 'center',
                                            minWidth: { xs: 24, md: 'unset' },
                                            minHeight: { xs: 'unset', md: 24 },
                                        }}
                                    />
                                )}
                            </TimelineSeparator>

                            <TimelineContent
                                sx={{
                                    color: 'white',
                                    fontWeight: step.completed || isCurrent ? 'bold' : 'normal',
                                    opacity: isClickable ? 1 : 0.5,
                                    display: { xs: 'none', md: 'block' },
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        cursor: isClickable ? 'pointer' : 'not-allowed',
                                        '&:hover': {
                                            textDecoration: isClickable ? 'underline' : 'none',
                                        },
                                    }}
                                    onClick={() => isClickable && goToStep(step.id)}
                                >
                                    {step.label}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    );
                })}
                {/* Extra Payment step (not clickable, just for show) */}
                {showPaymentStep && (
                    <TimelineItem
                        key="payment-step"
                        sx={{
                            minHeight: { xs: 'auto', md: '80px' },
                            display: 'flex',
                            flexDirection: 'row',
                            '& .MuiTimelineContent-root': {
                                marginLeft: '10px',
                                paddingTop: '10px',
                                paddingLeft: '8px',
                                paddingRight: '8px',
                            },
                            '& .MuiTimelineSeparator-root': {
                                flexDirection: { xs: 'row', md: 'column' },
                            },
                        }}
                    >
                        <TimelineSeparator>
                            <TimelineDot
                                sx={{
                                    width: { xs: '36px', md: '40px' },
                                    height: { xs: '36px', md: '40px' },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#aaa',
                                    backgroundColor: 'white',
                                    borderColor: 'white',
                                    borderWidth: '2px',
                                    borderStyle: 'solid',
                                    borderRadius: '50%',
                                    cursor: 'not-allowed',
                                    opacity: 0.5,
                                    margin: { xs: 'none', lg: 0 },
                                }}
                                variant="outlined"
                            >
                                <span style={{ color: '#aaa' }}>₹</span>
                            </TimelineDot>
                        </TimelineSeparator>
                        <TimelineContent
                            sx={{
                                color: '#aaa',
                                fontWeight: 'normal',
                                opacity: 0.5,
                                display: { xs: 'none', md: 'block' },
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'not-allowed',
                                }}
                            >
                                Payment
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>
                )}
            </Timeline>
        </div>
    );
}
