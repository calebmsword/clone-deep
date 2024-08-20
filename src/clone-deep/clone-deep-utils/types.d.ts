import { PendingResultItem, QueueItem } from "../../types";

type TypedArray =
  Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

type Layout = { offset: number, stride: number }[]

/** A "polyfill" for the AudioData type not provided in the version of 
 * TypeScript I am using. */
export interface AudioData {
    duration: number,
    format: string,
    numberOfChannels: number,
    numberOfFrames: number,
    sampleRate: number,
    timestamp: number,

    allocationSize: () => number,
    clone: () => AudioData,
    close: () => void,
    copyTo: (
        destination: ArrayBuffer | TypedArray | DataView,
        options: {
            planeIndex: number,
            frameOffset: number,
            frameCount: number
        }
    ) => Promise<Layout>
}

/** A "polyfill" for the VideoData type not provided in the version of 
 * TypeScript I am using. */
export interface VideoData {
    codedHeight: number,
    codedRect: DOMRectReadOnly,
    codedWidth: number,
    colorSpace: VideoColorSpace,
    displayHeight: number,
    displayWidth: number,
    duration: number,
    format: string,
    timestamp: number,
    visibleRect: DOMRectReadOnly,

    allocationSize: () => number,
    clone: () => VideoData,
    close: () => void,
    copyTo: (
        destination: ArrayBuffer | TypedArray | DataView,
        options: {
            rect: {
                x: number,
                y: number,
                width: number,
                height: number
            }
        },
        layout: {
            offset: number,
            stride: number
        },
        format: string,
        colorSpace: string
    ) => Promise<Layout>
}
