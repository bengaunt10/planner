from .models import Task

def does_overlap(task1: Task, task2: Task) -> bool:
    return task1.start_time < task2.end_time and task1.end_time > task2.start_time