import threading
import time

import requests

# Configuration parameters
# URL = "http://localhost:5017/sessions_users?presentation_id=3"
URL = "https://oratify.teamcoding.ro/api/sessions_users?presentation_id=3"
N_THREADS = 10  # Number of threads
M_REQUESTS = 300  # Total number of requests
DURATION = 40  # Duration of the test in seconds


class RequestThread(threading.Thread):
    def __init__(self, thread_id, url, max_requests, duration, results, request_count, lock):
        super().__init__()
        self.thread_id = thread_id
        self.url = url
        self.max_requests = max_requests
        self.duration = duration
        self.results = results
        self.request_count = request_count
        self.lock = lock

    def run(self):
        start_time = time.time()
        while time.time() - start_time < self.duration:
            with self.lock:
                total_requests = sum(self.request_count.values())
                if total_requests >= self.max_requests:
                    break
                self.request_count[self.thread_id] += 1

            try:
                response = requests.get(self.url)
                self.results.append((time.time(), response.status_code))
            except requests.RequestException as e:
                self.results.append((time.time(), str(e)))


def stress_test(url, n_threads, m_requests, duration):
    threads = []
    results = []
    request_count = {i: 0 for i in range(n_threads)}
    lock = threading.Lock()

    for i in range(n_threads):
        thread = RequestThread(i, url, m_requests, duration, results, request_count, lock)
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    return results, request_count


def main():
    start_time = time.time()
    results, request_count = stress_test(URL, N_THREADS, M_REQUESTS, DURATION)
    end_time = time.time()

    total_requests = sum(request_count.values())
    total_execution_time = end_time - start_time

    print(f"Total requests sent: {total_requests}")
    print(f"Total execution time: {total_execution_time:.2f} seconds")

    for thread_id, count in request_count.items():
        print(f"Thread {thread_id}: {count} requests")

    # Optionally, print detailed results
    for timestamp, status in results:
        print(f"Time: {timestamp}, Status: {status}")


if __name__ == "__main__":
    main()
