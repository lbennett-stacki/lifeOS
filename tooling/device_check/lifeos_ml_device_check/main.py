import argparse
import torch

def check_cuda():
    cuda_availability = torch.cuda.is_available()
    print(f"CUDA availability | {cuda_availability}")

def check_mps():
    mps_availability = torch.mps.is_available()
    print(f"MPS availability | {mps_availability}")

def main():
    parser = argparse.ArgumentParser(
        description="Check device"
    )
    parser.add_argument(
        "--skip-cuda",
        action="store_true",
        help="Skips checking CUDA",
    )
    parser.add_argument(
        "--skip-mps",
        action="store_true",
        help="Skips checking MPS",
    )
    args = parser.parse_args()


    if not args.skip_cuda:
        check_cuda()

    if not args.skip_mps:
        check_mps()


if __name__ == "__main__":
    main()
