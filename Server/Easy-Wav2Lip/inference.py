print("\rloading torch       ", end="")
import torch

print("\rloading numpy       ", end="")
import numpy as np

print("\rloading Image       ", end="")
from PIL import Image

print("\rloading argparse    ", end="")
import argparse

print("\rloading configparser", end="")
import configparser

print("\rloading math        ", end="")
import math

print("\rloading os          ", end="")
import os

print("\rloading subprocess  ", end="")
import subprocess

print("\rloading pickle      ", end="")
import pickle

print("\rloading cv2         ", end="")
import cv2

print("\rloading audio       ", end="")
import audio

print("\rloading RetinaFace ", end="")
from batch_face import RetinaFace

print("\rloading re          ", end="")
import re

print("\rloading partial     ", end="")
from functools import partial

print("\rloading tqdm        ", end="")
from tqdm import tqdm

print("\rloading warnings    ", end="")
import warnings

warnings.filterwarnings(
    "ignore", category=UserWarning, module="torchvision.transforms.functional_tensor"
)
print("\rloading upscale     ", end="")
from enhance import upscale

print("\rloading load_sr     ", end="")
from enhance import load_sr

print("\rloading load_model  ", end="")
from easy_functions import load_model, g_colab

print("\rimports loaded!     ")

import os
import pickle

device = 'cuda' if torch.cuda.is_available() else 'mps' if torch.backends.mps.is_available() else 'cpu'
gpu_id = 0 if torch.cuda.is_available() else -1

if device == 'cpu':
    print('Warning: No GPU detected so inference will be done on the CPU which is VERY SLOW!')
parser = argparse.ArgumentParser(
    description="Inference code to lip-sync videos in the wild using Wav2Lip models"
)

parser.add_argument(
    "--checkpoint_path",
    type=str,
    help="Name of saved checkpoint to load weights from",
    required=True,
)

parser.add_argument(
    "--segmentation_path",
    type=str,
    default="checkpoints/face_segmentation.pth",
    help="Name of saved checkpoint of segmentation network",
    required=False,
)

parser.add_argument(
    "--face",
    type=str,
    help="Filepath of video/image that contains faces to use",
    required=True,
)
parser.add_argument(
    "--audio",
    type=str,
    help="Filepath of video/audio file to use as raw audio source",
    required=True,
)
parser.add_argument(
    "--outfile",
    type=str,
    help="Video path to save result. See default for an e.g.",
    default="results/result_voice.mp4",
)

parser.add_argument(
    "--static",
    type=bool,
    help="If True, then use only first video frame for inference",
    default=False,
)
parser.add_argument(
    "--fps",
    type=float,
    help="Can be specified only if input is a static image (default: 25)",
    default=25.0,
    required=False,
)

parser.add_argument(
    "--pads",
    nargs="+",
    type=int,
    default=[0, 10, 0, 0],
    help="Padding (top, bottom, left, right). Please adjust to include chin at least",
)

parser.add_argument(
    "--wav2lip_batch_size", type=int, help="Batch size for Wav2Lip model(s)", default=1
)

parser.add_argument(
    "--out_height",
    default=480,
    type=int,
    help="Output video height. Best results are obtained at 480 or 720",
)

parser.add_argument(
    "--crop",
    nargs="+",
    type=int,
    default=[0, -1, 0, -1],
    help="Crop video to a smaller region (top, bottom, left, right). Applied after resize_factor and rotate arg. "
    "Useful if multiple face present. -1 implies the value will be auto-inferred based on height, width",
)

parser.add_argument(
    "--box",
    nargs="+",
    type=int,
    default=[-1, -1, -1, -1],
    help="Specify a constant bounding box for the face. Use only as a last resort if the face is not detected."
    "Also, might work only if the face is not moving around much. Syntax: (top, bottom, left, right).",
)

parser.add_argument(
    "--rotate",
    default=False,
    action="store_true",
    help="Sometimes videos taken from a phone can be flipped 90deg. If true, will flip video right by 90deg."
    "Use if you get a flipped result, despite feeding a normal looking video",
)

parser.add_argument(
    "--nosmooth",
    type=str,
    default=False,
    help="Prevent smoothing face detections over a short temporal window",
)

parser.add_argument(
    "--no_seg",
    default=False,
    action="store_true",
    help="Prevent using face segmentation",
)

parser.add_argument(
    "--no_sr", default=False, action="store_true", help="Prevent using super resolution"
)

parser.add_argument(
    "--sr_model",
    type=str,
    default="gfpgan",
    help="Name of upscaler - gfpgan or RestoreFormer",
    required=False,
)

parser.add_argument(
    "--fullres",
    default=3,
    type=int,
    help="used only to determine if full res is used so that no resizing needs to be done if so",
)

parser.add_argument(
    "--debug_mask",
    type=str,
    default=False,
    help="Makes background grayscale to see the mask better",
)

parser.add_argument(
    "--preview_settings", type=str, default=False, help="Processes only one frame"
)

parser.add_argument(
    "--mouth_tracking",
    type=str,
    default=False,
    help="Tracks the mouth in every frame for the mask",
)

parser.add_argument(
    "--mask_dilation",
    default=150,
    type=float,
    help="size of mask around mouth",
    required=False,
)

parser.add_argument(
    "--mask_feathering",
    default=151,
    type=int,
    help="amount of feathering of mask around mouth",
    required=False,
)

parser.add_argument(
    "--quality",
    type=str,
    help="Choose between Fast, Improved and Enhanced",
    default="Fast",
)

# Get the absolute path to the directory containing inference.py
script_dir = os.path.dirname(os.path.abspath(__file__))
print("script_dir : ", script_dir)

# Update paths to use the absolute path
predictor_path = os.path.join(script_dir, "checkpoints", "predictor.pkl")
mouth_detector_path = os.path.join(script_dir, "checkpoints", "mouth_detector.pkl")
mobilenet_path = os.path.join(script_dir, "checkpoints", "mobilenet.pth")

with open(predictor_path, "rb") as f:
    predictor = pickle.load(f)

with open(mouth_detector_path, "rb") as f:
    mouth_detector = pickle.load(f)

# creating variables to prevent failing when a face isn't detected
kernel = last_mask = x = y = w = h = None

g_colab = g_colab()

if not g_colab:
    # Load the config file
    config = configparser.ConfigParser()
    config_path = os.path.join(os.path.dirname(__file__), "config.ini")

    if os.path.exists(config_path):
        config.read(config_path)
        preview_window = config.get("OPTIONS", "preview_window", fallback="False")
    else:
        print("Warning: config.ini not found. Using default settings.")
        preview_window = "False"

all_mouth_landmarks = []

model = detector = detector_model = None

def do_load(checkpoint_path):
    global model, detector, detector_model

    # โหลดโมเดล Wav2Lip
    model = load_model(checkpoint_path)

    # ใช้ mobilenet.pth สำหรับ RetinaFace
    mobilenet_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "checkpoints", "mobilenet.pth"
    )
    detector = RetinaFace(
        gpu_id=gpu_id, model_path=mobilenet_path, network="mobilenet"
    )
    detector_model = detector.model


def face_rect(images):
    face_batch_size = 8
    num_batches = math.ceil(len(images) / face_batch_size)
    prev_ret = None
    for i in range(num_batches):
        batch = images[i * face_batch_size : (i + 1) * face_batch_size]
        all_faces = detector(batch)  # return faces list of all images
        for faces in all_faces:
            if faces:
                box, landmarks, score = faces[0]
                prev_ret = tuple(map(int, box))
            yield prev_ret

def create_tracked_mask(img, original_img):
    global kernel, last_mask, x, y, w, h  # Add last_mask to global variables

    # Convert color space from BGR to RGB if necessary
    cv2.cvtColor(img, cv2.COLOR_BGR2RGB, img)
    cv2.cvtColor(original_img, cv2.COLOR_BGR2RGB, original_img)

    # Detect face
    faces = mouth_detector(img)
    if len(faces) == 0:
        if last_mask is not None:
            last_mask = cv2.resize(last_mask, (img.shape[1], img.shape[0]))
            mask = last_mask  # use the last successful mask
        else:
            cv2.cvtColor(img, cv2.COLOR_BGR2RGB, img)
            return img, None
    else:
        face = faces[0]
        shape = predictor(img, face)

        # Get points for mouth
        mouth_points = np.array(
            [[shape.part(i).x, shape.part(i).y] for i in range(48, 68)]
        )

        # Calculate bounding box dimensions
        x, y, w, h = cv2.boundingRect(mouth_points)

        # Set kernel size as a fraction of bounding box size
        kernel_size = int(max(w, h) * args.mask_dilation)
        # if kernel_size % 2 == 0:  # Ensure kernel size is odd
        # kernel_size += 1

        # Create kernel
        kernel = np.ones((kernel_size, kernel_size), np.uint8)

        # Create binary mask for mouth
        mask = np.zeros(img.shape[:2], dtype=np.uint8)
        cv2.fillConvexPoly(mask, mouth_points, 255)

        last_mask = mask  # Update last_mask with the new mask

    # Dilate the mask
    dilated_mask = cv2.dilate(mask, kernel)

    # Calculate distance transform of dilated mask
    dist_transform = cv2.distanceTransform(dilated_mask, cv2.DIST_L2, 5)

    # Normalize distance transform
    cv2.normalize(dist_transform, dist_transform, 0, 255, cv2.NORM_MINMAX)

    # Convert normalized distance transform to binary mask and convert it to uint8
    _, masked_diff = cv2.threshold(dist_transform, 50, 255, cv2.THRESH_BINARY)
    masked_diff = masked_diff.astype(np.uint8)

    # make sure blur is an odd number
    blur = args.mask_feathering
    if blur % 2 == 0:
        blur += 1
    # Set blur size as a fraction of bounding box size
    blur = int(max(w, h) * blur)  # 10% of bounding box size
    if blur % 2 == 0:  # Ensure blur size is odd
        blur += 1
    masked_diff = cv2.GaussianBlur(masked_diff, (blur, blur), 0)

    # Convert numpy arrays to PIL Images
    input1 = Image.fromarray(img)
    input2 = Image.fromarray(original_img)

    # Convert mask to single channel where pixel values are from the alpha channel of the current mask
    mask = Image.fromarray(masked_diff)

    # Ensure images are the same size
    assert input1.size == input2.size == mask.size

    # Paste input1 onto input2 using the mask
    input2.paste(input1, (0, 0), mask)

    # Convert the final PIL Image back to a numpy array
    input2 = np.array(input2)

    # input2 = cv2.cvtColor(input2, cv2.COLOR_BGR2RGB)
    cv2.cvtColor(input2, cv2.COLOR_BGR2RGB, input2)

    return input2, mask


def create_mask(img, original_img):
    global kernel, last_mask, x, y, w, h # Add last_mask to global variables

    # Convert color space from BGR to RGB if necessary
    cv2.cvtColor(img, cv2.COLOR_BGR2RGB, img)
    cv2.cvtColor(original_img, cv2.COLOR_BGR2RGB, original_img)

    if last_mask is not None:
        last_mask = np.array(last_mask)  # Convert PIL Image to numpy array
        last_mask = cv2.resize(last_mask, (img.shape[1], img.shape[0]))
        mask = last_mask  # use the last successful mask
        mask = Image.fromarray(mask)

    else:
        # Detect face
        faces = mouth_detector(img)
        if len(faces) == 0:
            cv2.cvtColor(img, cv2.COLOR_BGR2RGB, img)
            return img, None
        else:
            face = faces[0]
            shape = predictor(img, face)

            # Get points for mouth
            mouth_points = np.array(
                [[shape.part(i).x, shape.part(i).y] for i in range(48, 68)]
            )

            # Calculate bounding box dimensions
            x, y, w, h = cv2.boundingRect(mouth_points)

            # Set kernel size as a fraction of bounding box size
            kernel_size = int(max(w, h) * args.mask_dilation)
            # if kernel_size % 2 == 0:  # Ensure kernel size is odd
            # kernel_size += 1

            # Create kernel
            kernel = np.ones((kernel_size, kernel_size), np.uint8)

            # Create binary mask for mouth
            mask = np.zeros(img.shape[:2], dtype=np.uint8)
            cv2.fillConvexPoly(mask, mouth_points, 255)

            # Dilate the mask
            dilated_mask = cv2.dilate(mask, kernel)

            # Calculate distance transform of dilated mask
            dist_transform = cv2.distanceTransform(dilated_mask, cv2.DIST_L2, 5)

            # Normalize distance transform
            cv2.normalize(dist_transform, dist_transform, 0, 255, cv2.NORM_MINMAX)

            # Convert normalized distance transform to binary mask and convert it to uint8
            _, masked_diff = cv2.threshold(dist_transform, 50, 255, cv2.THRESH_BINARY)
            masked_diff = masked_diff.astype(np.uint8)

            if not args.mask_feathering == 0:
                blur = args.mask_feathering
                # Set blur size as a fraction of bounding box size
                blur = int(max(w, h) * blur)  # 10% of bounding box size
                if blur % 2 == 0:  # Ensure blur size is odd
                    blur += 1
                masked_diff = cv2.GaussianBlur(masked_diff, (blur, blur), 0)

            # Convert mask to single channel where pixel values are from the alpha channel of the current mask
            mask = Image.fromarray(masked_diff)

            last_mask = mask  # Update last_mask with the final mask after dilation and feathering

    # Convert numpy arrays to PIL Images
    input1 = Image.fromarray(img)
    input2 = Image.fromarray(original_img)

    # Resize mask to match image size
    # mask = Image.fromarray(mask)
    mask = mask.resize(input1.size)

    # Ensure images are the same size
    assert input1.size == input2.size == mask.size

    # Paste input1 onto input2 using the mask
    input2.paste(input1, (0, 0), mask)

    # Convert the final PIL Image back to a numpy array
    input2 = np.array(input2)

    # input2 = cv2.cvtColor(input2, cv2.COLOR_BGR2RGB)
    cv2.cvtColor(input2, cv2.COLOR_BGR2RGB, input2)

    return input2, mask


def get_smoothened_boxes(boxes, T):
    for i in range(len(boxes)):
        if i + T > len(boxes):
            window = boxes[len(boxes) - T :]
        else:
            window = boxes[i : i + T]
        boxes[i] = np.mean(window, axis=0)
    return boxes
            
def face_detect(images, results_file="last_detected_face.pkl"):
    """
    Detect faces in a list of images and return bounding boxes with padding.
    """
    if os.path.exists(results_file):
        print("Using cached face detection results.")
        with open(results_file, "rb") as f:
            return pickle.load(f)

    results = []
    pady1, pady2, padx1, padx2 = args.pads
    prev_rect = None  # Store the last valid bounding box

    for i, image in enumerate(tqdm(images, desc="Detecting faces", ncols=100)):
        faces = detector([image])  # Detect faces in the current frame
        if faces[0]:  # Face detected
            box, landmarks, score = faces[0][0]
            rect = tuple(map(int, box))
            prev_rect = rect  # Update last valid bounding box
        else:  # No face detected
            print(f"No face detected in frame {i}. Using fallback.")
            if prev_rect:
                rect = prev_rect  # Use the previous valid bounding box
            else:
                # Fallback to using the entire image
                rect = (0, image.shape[0], 0, image.shape[1])

        # Apply padding to the bounding box
        y1 = max(0, rect[1] - pady1)
        y2 = min(image.shape[0], rect[3] + pady2)
        x1 = max(0, rect[0] - padx1)
        x2 = min(image.shape[1], rect[2] + padx2)

        # Ensure bounding box is valid
        if y1 >= y2 or x1 >= x2:
            print(f"Invalid bounding box for frame {i}: {rect}. Skipping.")
            results.append(None)  # Mark as invalid
        else:
            results.append([x1, y1, x2, y2])

    # Save results for future use
    with open(results_file, "wb") as f:
        pickle.dump(results, f)

    return results

def datagen(frames, mels):
    """
    Generator to yield batches of face crops and corresponding audio Mel spectrograms.
    """
    img_batch, mel_batch, frame_batch, coords_batch = [], [], [], []

    # Get face detection results
    face_det_results = face_detect(frames)

    for i, m in enumerate(mels):
        idx = 0 if args.static else i % len(frames)

        # Skip invalid face detection results
        if not face_det_results[idx]:
            print(f"Skipping frame {idx} due to invalid face detection.")
            continue

        x1, y1, x2, y2 = face_det_results[idx]
        face = frames[idx][y1:y2, x1:x2]  # Crop face region

        # Resize face to model input size
        face = cv2.resize(face, (args.img_size, args.img_size))

        img_batch.append(face)
        mel_batch.append(m)
        frame_batch.append(frames[idx])
        coords_batch.append((x1, y1, x2, y2))

        # Yield a batch when enough data is collected
        if len(img_batch) >= args.wav2lip_batch_size:
            img_batch, mel_batch = prepare_batch(img_batch, mel_batch)
            yield img_batch, mel_batch, frame_batch, coords_batch
            img_batch, mel_batch, frame_batch, coords_batch = [], [], [], []

    # Yield remaining data
    if img_batch:
        img_batch, mel_batch = prepare_batch(img_batch, mel_batch)
        yield img_batch, mel_batch, frame_batch, coords_batch


def prepare_batch(img_batch, mel_batch):
    """
    Prepare image and mel batches for the model.
    """
    img_batch = np.asarray(img_batch) / 255.0
    mel_batch = np.asarray(mel_batch)
    img_batch = np.transpose(img_batch, (0, 3, 1, 2))
    mel_batch = np.reshape(mel_batch, [len(mel_batch), mel_batch.shape[1], mel_batch.shape[2], 1])
    return img_batch, mel_batch

mel_step_size = 16

def _load(checkpoint_path):
    if device != "cpu":
        checkpoint = torch.load(checkpoint_path)
    else:
        checkpoint = torch.load(
            checkpoint_path, map_location=lambda storage, loc: storage
        )
    return checkpoint


import os

def main():
    args.img_size = 96

    # ลบไฟล์ชั่วคราวก่อนเริ่มกระบวนการ
    temp_dir = "temp"
    output_video_path = os.path.join(temp_dir, "result.mp4")
    if os.path.exists(output_video_path):
        os.remove(output_video_path)
    if os.path.exists("last_detected_face.pkl"):
        os.remove("last_detected_face.pkl")

    # ตรวจสอบว่า input file (face) มีอยู่จริง
    if not os.path.isfile(args.face):
        raise ValueError("--face argument must be a valid path to video/image file")

    # อ่านเฟรมจากไฟล์ (รูปภาพหรือวิดีโอ)
    if args.face.split(".")[1] in ["jpg", "png", "jpeg"]:
        args.static = True
        full_frames = [cv2.imread(args.face)]
        fps = args.fps
    else:
        video_stream = cv2.VideoCapture(args.face)
        fps = video_stream.get(cv2.CAP_PROP_FPS)
        full_frames = []
        while True:
            still_reading, frame = video_stream.read()
            if not still_reading:
                video_stream.release()
                break
            if args.fullres != 1:
                aspect_ratio = frame.shape[1] / frame.shape[0]
                frame = cv2.resize(
                    frame, (int(args.out_height * aspect_ratio), args.out_height)
                )
            full_frames.append(frame)

    # ตรวจสอบไฟล์เสียงและแปลงเป็น WAV หากจำเป็น
    if not args.audio.endswith(".wav"):
        print("Converting audio to .wav")
        os.makedirs(temp_dir, exist_ok=True)
        wav_path = os.path.join(temp_dir, "temp.wav")
        subprocess.check_call(
            [
                "ffmpeg",
                "-y",
                "-loglevel",
                "error",
                "-i",
                args.audio,
                wav_path,
            ]
        )
        args.audio = wav_path

    # วิเคราะห์เสียงและสร้าง Mel Spectrogram
    print("Analyzing audio...")
    wav = audio.load_wav(args.audio, 16000)
    mel = audio.melspectrogram(wav)
    if np.isnan(mel.reshape(-1)).sum() > 0:
        raise ValueError("Mel contains NaN! Please check your audio file.")

    # สร้าง Mel chunks
    mel_chunks = []
    mel_idx_multiplier = 80.0 / fps
    i = 0
    while True:
        start_idx = int(i * mel_idx_multiplier)
        if start_idx + mel_step_size > len(mel[0]):
            mel_chunks.append(mel[:, len(mel[0]) - mel_step_size:])
            break
        mel_chunks.append(mel[:, start_idx: start_idx + mel_step_size])
        i += 1

    # จำกัดจำนวนเฟรมตาม Mel chunks
    full_frames = full_frames[:len(mel_chunks)]

    # ตรวจสอบว่ามีเฟรมและ Mel chunks ให้ประมวลผล
    if len(full_frames) == 0 or len(mel_chunks) == 0:
        raise ValueError("No frames or Mel chunks available for processing.")

    # เขียนวิดีโอ
    out = None
    for i, (img_batch, mel_batch, frames, coords) in enumerate(
        datagen(full_frames, mel_chunks)
    ):
        if i == 0:
            frame_h, frame_w = full_frames[0].shape[:-1]
            fourcc = cv2.VideoWriter_fourcc(*"mp4v")
            out = cv2.VideoWriter(output_video_path, fourcc, fps, (frame_w, frame_h))

        for frame in frames:
            out.write(frame)

    # ปิด VideoWriter
    if out is not None:
        out.release()
        print(f"Intermediate video saved to {output_video_path}")

    # ตรวจสอบว่าไฟล์วิดีโอถูกสร้างสำเร็จ
    if not os.path.exists(output_video_path):
        raise FileNotFoundError(f"Output video file not found: {output_video_path}")

    # รวมไฟล์วิดีโอและเสียงด้วย ffmpeg
    final_video_path = args.outfile
    subprocess.check_call([
        "ffmpeg",
        "-y",
        "-loglevel",
        "error",
        "-i",
        output_video_path,
        "-i",
        args.audio,
        "-c:v",
        "libx264",
        final_video_path
    ])
    print(f"Final video saved to {final_video_path}")

if __name__ == "__main__":
    args = parser.parse_args()
    do_load(args.checkpoint_path)
    main()
