# Generated by Django 5.1.6 on 2025-03-25 09:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0015_remove_task_duedate'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='due_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
