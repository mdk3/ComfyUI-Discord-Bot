const promptTxt = `{
    "1": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": {
            "ckpt_name": "epicrealism_pureEvolutionV5.safetensors"
        }
    },
    "10": {
        "class_type": "VAEDecode",
        "inputs": {
            "samples": [
                "8",
                0
            ],
            "vae": [
                "3",
                0
            ]
        }
    },
    "11": {
        "class_type": "PreviewImage",
        "inputs": {
            "images": [
                "10",
                0
            ]
        }
    },
    "12": {
        "class_type": "ReActorFaceSwap",
        "inputs": {
            "console_log_level": 1,
            "input_faces_index": "0",
            "input_image": [
                "15",
                0
            ],
            "reference_faces_index": "0",
            "reference_image": [
                "13",
                0
            ],
            "swap_model": "inswapper_128.onnx"
        }
    },
    "13": {
        "class_type": "LoadImage",
        "inputs": {
            "choose file to upload": "image",
            "image": "test"
        }
    },
    "15": {
        "class_type": "FaceDetailer",
        "inputs": {
            "bbox_crop_factor": 3,
            "bbox_detector": [
                "16",
                0
            ],
            "bbox_dilation": 10,
            "bbox_threshold": 0.5,
            "cfg": 8,
            "clip": [
                "1",
                1
            ],
            "denoise": 0.4,
            "drop_size": 10,
            "feather": 10,
            "force_inpaint": true,
            "guide_size": 256,
            "guide_size_for": true,
            "image": [
                "25",
                0
            ],
            "max_size": 768,
            "model": [
                "1",
                0
            ],
            "negative": [
                "20",
                0
            ],
            "noise_mask": true,
            "positive": [
                "19",
                0
            ],
            "sam_bbox_expansion": 0,
            "sam_detection_hint": "center-1",
            "sam_dilation": 0,
            "sam_mask_hint_threshold": 0.7,
            "sam_mask_hint_use_negative": "False",
            "sam_model_opt": [
                "17",
                0
            ],
            "sam_threshold": 0.93,
            "sampler_name": "dpmpp_2m_sde_gpu",
            "scheduler": "karras",
            "seed": 144993888869204,
            "segm_detector_opt": [
                "16",
                1
            ],
            "steps": 20,
            "vae": [
                "3",
                0
            ],
            "wildcard": ""
        }
    },
    "16": {
        "class_type": "UltralyticsDetectorProvider",
        "inputs": {
            "model_name": "bbox/face_yolov8m.pt"
        }
    },
    "17": {
        "class_type": "SAMLoader",
        "inputs": {
            "device_mode": "AUTO",
            "model_name": "sam_vit_b_01ec64.pth"
        }
    },
    "18": {
        "class_type": "PreviewImage",
        "inputs": {
            "images": [
                "15",
                0
            ]
        }
    },
    "19": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "clip": [
                "1",
                1
            ],
            "text": ""
        }
    },
    "20": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "clip": [
                "1",
                1
            ],
            "text": ""
        }
    },
    "21": {
        "class_type": "FaceRestoreModelLoader",
        "inputs": {
            "model_name": "GFPGANv1.4.pth"
        }
    },
    "22": {
        "class_type": "FaceRestoreWithModel",
        "inputs": {
            "facedetection": "YOLOv5l",
            "facerestore_model": [
                "21",
                0
            ],
            "image": [
                "12",
                0
            ]
        }
    },
    "23": {
        "class_type": "PreviewImage",
        "inputs": {
            "images": [
                "22",
                0
            ]
        }
    },
    "25": {
        "class_type": "ImpactImageBatchToImageList",
        "inputs": {
            "image": [
                "10",
                0
            ]
        }
    },
    "29": {
        "class_type": "UpscaleModelLoader",
        "inputs": {
            "model_name": "ESRGAN_4x.pth"
        }
    },
    "3": {
        "class_type": "VAELoader",
        "inputs": {
            "vae_name": "vae-ft-mse-840000-ema-pruned.ckpt"
        }
    },
    "31": {
        "class_type": "ImageUpscaleWithModel",
        "inputs": {
            "image": [
                "22",
                0
            ],
            "upscale_model": [
                "29",
                0
            ]
        }
    },
    "32": {
        "class_type": "SaveImage",
        "inputs": {
            "filename_prefix": "upscaled",
            "images": [
                "31",
                0
            ]
        }
    },
    "33": {
        "class_type": "SaveImage",
        "inputs": {
            "filename_prefix": "non-upscaled",
            "images": [
                "22",
                0
            ]
        }
    },
    "4": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "clip": [
                "1",
                1
            ],
            "text": ""
        }
    },
    "5": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "clip": [
                "1",
                1
            ],
            "text": ""
        }
    },
    "8": {
        "class_type": "KSampler",
        "inputs": {
            "cfg": 8.99998474121094,
            "denoise": 1,
            "latent_image": [
                "9",
                0
            ],
            "model": [
                "1",
                0
            ],
            "negative": [
                "5",
                0
            ],
            "positive": [
                "4",
                0
            ],
            "sampler_name": "dpmpp_2m_sde_gpu",
            "scheduler": "karras",
            "seed": 982957440002586,
            "steps": 60
        }
    },
    "9": {
        "class_type": "EmptyLatentImage",
        "inputs": {
            "batch_size": 1,
            "height": 912,
            "width": 768
        }
    }
}`;

exports.promptTxt = promptTxt;