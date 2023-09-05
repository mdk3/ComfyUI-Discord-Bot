const promptTxt = `{
    "1": {
      "inputs": {
        "ckpt_name": "sd_xl_base_1.0_0.9vae.safetensors"
      },
      "class_type": "CheckpointLoaderSimple"
    },
    "3": {
      "inputs": {
        "vae_name": "sdxl_vae.safetensors"
      },
      "class_type": "VAELoader"
    },
    "8": {
      "inputs": {
        "seed": 574111273299632,
        "steps": 60,
        "cfg": 8.999984741210938,
        "sampler_name": "dpmpp_2m_sde_gpu",
        "scheduler": "karras",
        "denoise": 1,
        "model": [
          "1",
          0
        ],
        "positive": [
          "34",
          0
        ],
        "negative": [
          "35",
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
        "width": [
          "36",
          0
        ],
        "height": [
          "37",
          0
        ],
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
    },
    "34": {
      "inputs": {
        "width": [
          "36",
          0
        ],
        "height": [
          "37",
          0
        ],
        "crop_w": 0,
        "crop_h": 0,
        "target_width": [
          "36",
          0
        ],
        "target_height": [
          "37",
          0
        ],
        "text_g": [
          "40",
          0
        ],
        "text_l": [
          "40",
          0
        ],
        "clip": [
          "1",
          1
        ]
      },
      "class_type": "CLIPTextEncodeSDXL"
    },
    "35": {
      "inputs": {
        "width": [
          "36",
          0
        ],
        "height": [
          "37",
          0
        ],
        "crop_w": 0,
        "crop_h": 0,
        "target_width": [
          "36",
          0
        ],
        "target_height": [
          "37",
          0
        ],
        "text_g": [
          "41",
          0
        ],
        "text_l": [
          "41",
          0
        ],
        "clip": [
          "1",
          1
        ]
      },
      "class_type": "CLIPTextEncodeSDXL"
    },
    "36": {
      "inputs": {
        "value": 512
      },
      "class_type": "ImpactInt"
    },
    "37": {
      "inputs": {
        "value": 768
      },
      "class_type": "ImpactInt"
    },
    "40": {
      "inputs": {
        "string": "positiveprompt"
      },
      "class_type": "String to Text"
    },
    "41": {
      "inputs": {
        "string": "negativeprompt"
      },
      "class_type": "String to Text"
    }
  }`;

exports.promptTxt = promptTxt;
