import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import SignatureCanvas from 'react-signature-canvas';
import { uploadFileToS3 } from 'src/api/utils';

interface RHFSignaturePadProps {
    name: string;
    label?: string;
    required?: boolean;
    helperText?: string;
    disabled?: boolean;
}

export function RHFSignaturePad({
    name,
    label,
    required,
    helperText,
    disabled,
}: RHFSignaturePadProps) {
    const { control, setValue, watch } = useFormContext();
    const signatureRef = useRef<SignatureCanvas>(null);
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const signatureUrl = watch(name);

    // Determine if signature is saved by checking if we have a valid S3 URL
    const isSaved = signatureUrl && typeof signatureUrl === 'string' && signatureUrl.startsWith('http');
    
    // When disabled, always show image-only mode if signature exists
    const showImageOnly = disabled && isSaved;

    const handleEndStroke = () => {
        if (signatureRef.current) {
            const isEmpty = signatureRef.current.isEmpty();
            setIsCanvasEmpty(isEmpty);
        }
    };

    const clearSignature = () => {
        if (signatureRef.current) {
            signatureRef.current.clear();
            setIsCanvasEmpty(true);
            setValue(name, '');
        }
    };

    const saveSignature = async () => {
        if (signatureRef.current && !isCanvasEmpty) {
            setIsUploading(true);
            try {
                // Get the canvas element and convert to blob
                const canvas = signatureRef.current.getCanvas();
                canvas.toBlob(
                    async (blob) => {
                        if (!blob) {
                            console.error('Failed to create blob from signature');
                            setIsUploading(false);
                            return;
                        }

                        // Create file from blob
                        const file = new File([blob], `signature_${Date.now()}.png`, {
                            type: 'image/png',
                        });

                        try {
                            // Upload to S3 using utility function
                            const s3Url = await uploadFileToS3(file);
                            console.log('Signature uploaded to S3:', s3Url);
                            
                            // Store S3 URL in form
                            setValue(name, s3Url);
                            setIsUploading(false);
                        } catch (uploadError) {
                            console.error('Error uploading signature:', uploadError);
                            setIsUploading(false);
                        }
                    },
                    'image/png'
                );
            } catch (error) {
                console.error('Error processing signature:', error);
                setIsUploading(false);
            }
        }
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ fieldState: { error } }) => (
                <div>
                    <div className="mt-4">
                        {/* Signature Canvas Area */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                {isSaved ? 'Signature Preview:' : (label || 'Please Sign Below')}
                                {required && <span className="text-red-500">*</span>}
                            </label>

                            {/* Canvas - hidden when disabled or signature is saved */}
                            {!showImageOnly && (
                                <div
                                    className={`w-[500px] h-[200px] border border-gray-300 rounded-md overflow-hidden ${isSaved ? 'hidden' : ''}`}
                                >
                                    <SignatureCanvas
                                        penColor="black"
                                        ref={signatureRef}
                                        canvasProps={{
                                            width: 500,
                                            height: 200,
                                            className:
                                                'sigCanvas bg-white cursor-crosshair w-[500px] h-[200px]',
                                        }}
                                        onEnd={handleEndStroke}
                                        backgroundColor="rgb(255,255,255)"
                                    />
                                </div>
                            )}

                            {isSaved && signatureUrl && (
                                <img
                                    src={signatureUrl}
                                    alt="User's Signature"
                                    className="border border-gray-300 rounded-md max-w-full h-auto mt-2"
                                />
                            )}
                        </div>

                        {/* Action Buttons - hidden when disabled */}
                        {!disabled && (
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-2">
                                <button
                                    type="button"
                                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md border border-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 cursor-pointer"
                                    onClick={clearSignature}
                                    disabled={isUploading}
                                >
                                    Clear Signature
                                </button>
                                {!isSaved && (
                                    <button
                                        type="button"
                                        disabled={isCanvasEmpty || isUploading}
                                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-white hover:text-orange-600 cursor-pointer disabled:opacity-50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:cursor-not-allowed transition-colors duration-300 hover:border hover:border-orange-600"
                                        onClick={saveSignature}
                                    >
                                        {isUploading ? 'Uploading...' : 'Save Signature'}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Terms Text */}
                        <p className="text-xs text-gray-500 mt-6 text-center">
                            By signing, you agree to the terms and conditions.
                        </p>

                        {/* Error message */}
                        {error && (
                            <p className="text-sm text-red-600 mt-2">{error.message}</p>
                        )}

                        {/* Helper text */}
                        {helperText && !error && (
                            <p className="text-sm text-gray-500 mt-2">{helperText}</p>
                        )}
                    </div>
                </div>
            )}
        />
    );
}
