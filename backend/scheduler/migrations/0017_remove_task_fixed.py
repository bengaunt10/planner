# Generated by Django 5.1.6 on 2025-03-26 11:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0016_task_due_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='fixed',
        ),
    ]
