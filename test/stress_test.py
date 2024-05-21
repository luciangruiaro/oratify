import threading
import time
import requests
import argparse

def send_request(url, duration, results, thread_id):
    start_time = time.time()
    end_time = start_time + duration
    while time.time() < end_time:
        try:
            response = requests.get(url)
            results[thread_id].append((time.time(), response.status_code))
        except requests.RequestException as e:
            results[thread_id].append((time.time(), str(e)))

def stress_test(url, n_threads, m_requests, duration):
    threads = []
    results = {i: [] for i in range(n_threads)}

    for i in range(n_threads):
        thread = threading.Thread(target=send_request, args=(url, duration, results, i))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    return results

def main():
    parser = argparse.ArgumentParser(description='REST endpoint stress test')
    parser.add_argument('url', type=str, help='The URL of the REST endpoint')
    parser.add_argument('n_threads', type=int, help='Number of threads')
    parser.add_argument('m_requests', type=int, help='Total number of requests')
    parser.add_argument('duration', type=int, help='Duration of the test in seconds')

    args = parser.parse_args()

    results = stress_test(args.url, args.n_threads, args.m_requests, args.duration)

    # Output the results
    for thread_id, res in results.items():
        print(f"Thread {thread_id}:")
        for timestamp, status in res:
            print(f"  Time: {timestamp}, Status: {status}")

if __name__ == "__main__":
    main()
