const promptTxt = `{
    "1": {
        "inputs": {
            "ckpt_name": "epicrealism_pureEvolutionV5.safetensors"
        },
        "class_type": "CheckpointLoaderSimple"
    },
    "3": {
        "inputs": {
            "vae_name": "vae-ft-mse-840000-ema-pruned.ckpt"
        },
        "class_type": "VAELoader"
    },
    "4": {
        "inputs": {
            "text": "",
            "clip": [
                "1",
                1
            ]
        },
        "class_type": "CLIPTextEncode"
    },
    "5": {
        "inputs": {
            "text": "",
            "clip": [
                "1",
                1
            ]
        },
        "class_type": "CLIPTextEncode"
    },
    "8": {
        "inputs": {
            "seed": 982957440002586,
            "steps": 60,
            "cfg": 8,
            "sampler_name": "dpmpp_2m_sde_gpu",
            "scheduler": "karras",
            "denoise": 1,
            "model": [
                "1",
                0
            ],
            "positive": [
                "4",
                0
            ],
            "negative": [
                "5",
                0
            ],
            "latent_image": [
                "9",
                0
            ]
        },
        "class_type": "KSampler"
    },
    "9": {
        "inputs": {
            "width": 768,
            "height": 912,
            "batch_size": 1
        },
        "class_type": "EmptyLatentImage"
    },
    "10": {
        "inputs": {
            "samples": [
                "8",
                0
            ],
            "vae": [
                "3",
                0
            ]
        },
        "class_type": "VAEDecode"
    },
    "29": {
        "inputs": {
            "model_name": "ESRGAN_4x.pth"
        },
        "class_type": "UpscaleModelLoader"
    },
    "31": {
        "inputs": {
            "upscale_model": [
                "29",
                0
            ],
            "image": [
                "10",
                0
            ]
        },
        "class_type": "ImageUpscaleWithModel"
    },
    "32": {
        "inputs": {
            "filename_prefix": "upscaled",
            "images": [
                "31",
                0
            ]
        },
        "class_type": "SaveImage"
    },
    "33": {
        "inputs": {
            "filename_prefix": "non-upscaled",
            "images": [
                "10",
                0
            ]
        },
        "class_type": "SaveImage"
    }
}`;

exports.promptTxt = promptTxt;
