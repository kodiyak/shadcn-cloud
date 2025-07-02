import { useDropzone, type Accept } from 'react-dropzone';
import { cn } from '../lib/utils';
import { ImagesIcon, MousePointerClickIcon, TrashIcon } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface DropzoneProps {
  value?: File | null;
  onChange?: (value: File | null) => void;
  name?: string;
  id?: string;
  className?: string;
  placeholder?: string;
  accept?: Accept;
  autoFocus?: boolean;
  disabled?: boolean;
  maxFiles?: number;
  preview?: (file: File) => ReactNode;
}
function Dropzone({
  className,
  placeholder,
  onChange,
  value,
  name,
  id,
  preview,
  ...rest
}: DropzoneProps) {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onChange?.(acceptedFiles[0]);
    } else {
      onChange?.(null);
    }
  };
  const { getRootProps, getInputProps, isDragActive, isDragReject, open } =
    useDropzone({
      onDrop,
      noClick: true,
      ...rest,
    });

  const supportedFormats = Object.keys(rest.accept || {}).flatMap((key) => {
    return (rest.accept?.[key] ?? []).map((ext) => ext.replace(/^\./, ''));
  });

  return (
    <>
      <div
        className={cn(
          'w-full rounded-xl bg-background/50 border h-40',
          value ? '' : 'cursor-pointer select-none hover:bg-muted/20',
          !value && isDragActive && !isDragReject ? 'bg-success/50 ' : '',
          !value && isDragReject ? 'bg-destructive/10' : '',
          !value && 'border-dashed',
          className,
        )}
        {...getRootProps({
          onClick: () => {
            if (!value) open();
          },
        })}
      >
        <input {...getInputProps({ id, name })} />
        {value ? (
          <>
            <div className="w-full h-full flex gap-4 p-4">
              <div className="h-full aspect-square">{preview?.(value)}</div>
              <div className="flex flex-col flex-1 gap-2">
                <span className="text-sm">{value.name}</span>
                <span className="text-xs font-mono text-muted-foreground">
                  {value.size > 1024 * 1024
                    ? `${(value.size / (1024 * 1024)).toFixed(2)} MB`
                    : `${(value.size / 1024).toFixed(2)} KB`}
                </span>
                <div className="flex items-center justify-between mt-auto">
                  <Badge variant={'muted'}>{value.type}</Badge>
                  <Button
                    size={'icon'}
                    variant={'destructive-ghost'}
                    onClick={() => {
                      onChange?.(null);
                    }}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col size-full items-center justify-center gap-2">
              <div className="size-12 rounded-full border bg-muted flex items-center justify-center">
                <MousePointerClickIcon className="size-6" />
              </div>
              <div className="text-xs text-muted-foreground flex flex-col items-center text-center max-w-3/4">
                <p>
                  {placeholder ||
                    'Drag and drop a file here, or click to select'}
                </p>
                {supportedFormats.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 mt-2">
                      <strong>Supported formats: </strong>
                      {supportedFormats.map((f) => (
                        <Badge variant={'muted'} key={`f.${f}`}>
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

type DropzoneImageProps = {
  value?: File | null;
  onChange?: (value: File | null) => void;
  name?: string;
  id?: string;
  className?: string;
  placeholder?: string;
  accept?: Accept;
  disabled?: boolean;
  maxFiles?: number;
};

function DropzoneImage({
  value,
  onChange,
  name,
  id,
  className,
  placeholder,
  accept,
  disabled = false,
  maxFiles = 1,
}: DropzoneImageProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const {
    inputRef,
    isDragAccept,
    isDragActive,
    isDragReject,
    getInputProps,
    open,
    getRootProps,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onChange?.(file);
      } else {
        onChange?.(null);
      }
    },
    noClick: true,
    accept,
    disabled,
    noDrag: true,
    maxFiles,
  });

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  return (
    <div
      {...getRootProps({
        className: cn(
          'size-full rounded-xl relative bg-background/50 border border-dashed',
          value ? '' : 'cursor-pointer select-none hover:bg-muted/20',
          !value && isDragActive && !isDragReject ? 'bg-success/50 ' : '',
          !value && isDragReject ? 'bg-destructive/10' : '',
          !value && 'border-dashed',
          className,
        ),
        onClick: () => {
          if (!value) open();
        },
      })}
    >
      <input
        {...getInputProps({
          ref: inputRef,
          id,
          name,
          disabled,
        })}
      />
      {value && previewUrl ? (
        <div className="size-full absolute inset-0 overflow-hidden">
          <img
            src={previewUrl}
            alt={value.name}
            className="size-full object-cover rounded-xl border relative z-10"
          />
          <div className="absolute size-full inset-0 z-20 bg-gradient-to-b rounded-xl from-transparent to-background/80 flex flex-col">
            <div className="flex-1"></div>
            <span className="text-xs px-1 text-muted-foreground truncate">
              {value.name}
            </span>
            <div className="p-1 flex justify-end">
              <Button
                type="button"
                size={'icon-xs'}
                variant={'destructive-ghost'}
                onClick={(e) => {
                  onChange?.(null);
                }}
              >
                <TrashIcon />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full gap-2">
          <ImagesIcon className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground text-center">
            {placeholder}
          </span>
        </div>
      )}
    </div>
  );
}

export { Dropzone, DropzoneImage, useDropzone };
